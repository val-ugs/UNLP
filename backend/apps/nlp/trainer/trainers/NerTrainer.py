import os
import string
import numpy as np
from transformers import AutoModelForTokenClassification, AutoTokenizer, DataCollatorForTokenClassification, Trainer, TrainingArguments, TrainerCallback
from apps.common.models import NerLabel, NlpDataset, NlpToken, NlpTokenNerLabel
from apps.common.serializers import NlpTokenNerLabelSerializer
from apps.nlp.preparers.NerPreparer import NerPreparer
from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id
from evaluate import EvaluationModule
from typing import List

#  Importance!!! DataFrame has columns: 'text', 'labels'

class NerTrainer:
    def __init__(
            self, 
            model_name_or_path: string, 
            training_args: TrainingArguments, 
            metric: EvaluationModule,
            train_nlp_dataset: NlpDataset,
            valid_nlp_dataset: NlpDataset,
            output_dir: string,
            callbacks: List[TrainerCallback]
        ):
        train_df = convert_nlp_dataset_to_df(train_nlp_dataset)
        valid_df = convert_nlp_dataset_to_df(valid_nlp_dataset)
        self.metric = metric
        self.train_df = train_df
        self.output_dir = output_dir

        self.list_of_tags = [tag for tag_list in train_df["tags"].tolist() for tag in tag_list]
        self.id2label, self.label2id = get_id2label_label2id(self.list_of_tags)
        model = AutoModelForTokenClassification.from_pretrained(
            pretrained_model_name_or_path=model_name_or_path,
            num_labels=len(self.id2label),
            id2label=self.id2label,
            label2id=self.label2id
        )

        tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=model_name_or_path)
        self.preparation = NerPreparer(tokenizer)

        tokenized_train_dataset = self.preparation.get_dataset(train_df)
        tokenized_val_dataset = self.preparation.get_dataset(valid_df)

        data_collator = DataCollatorForTokenClassification(tokenizer=tokenizer)

        self.trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=tokenized_train_dataset,
            eval_dataset=tokenized_val_dataset,
            tokenizer=tokenizer,
            data_collator=data_collator,
            compute_metrics=self.__compute_metrics,
            callbacks=callbacks
        )

    def train(self):
        self.trainer.train()
        self.trainer.save_model(self.output_dir)
        return self.trainer.state.log_history

    def predict(self, test_nlp_dataset: NlpDataset):
        self.__validate_nlp_dataset(test_nlp_dataset)

        test_df = convert_nlp_dataset_to_df(test_nlp_dataset)
        test_dataset = self.preparation.get_dataset(test_df)
        predictions, labels, metrics = self.trainer.predict(test_dataset, metric_key_prefix='predict')

        print(test_df[['tokens_ids', 'tokens']])

        predictions = np.argmax(predictions, axis=2)

        # Remove ignored index (special tokens)
        true_predictions = [
            [self.id2label[p] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]

        for text_index, tokens_ids in enumerate(test_df['tokens_ids'].tolist()):
            for token_index, token_id in enumerate(tokens_ids):
                # print(true_predictions[text_index][token_index])
                label = true_predictions[text_index][token_index]
                if label != 'O':
                    initial = label.split('-')[0] == 'B'
                    label_name = label.split('-')[1]
                    ner_label = NerLabel.objects.get(nlp_dataset=test_nlp_dataset, name=label_name)
                    # print(f'initial: {initial}, ner_label: {ner_label.name}')

                    nlp_token = NlpToken.objects.get(id=token_id)
                    nlp_token_ner_label, _ = NlpTokenNerLabel.objects.get_or_create(nlp_token=nlp_token)
                    if not nlp_token_ner_label.ner_label: #  set ner label if not defined
                        # print(f'token id without ner_label: {nlp_token.id}')
                        nlp_token_ner_label_serializer = NlpTokenNerLabelSerializer(instance=nlp_token_ner_label, ner_label=ner_label, initial=initial)
                        if nlp_token_ner_label_serializer.is_valid():
                            nlp_token_ner_label_serializer.save()

        return metrics
    
    def __validate_nlp_dataset(self, test_nlp_dataset):
        if NerLabel.objects.filter(nlp_dataset=test_nlp_dataset).exists():
            raise Exception('Test dataset has NER labels.');

    def __compute_metrics(self, eval_pred):
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=2)
        
        true_predictions = [
            [self.list_of_tags[p] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]
        true_labels = [
            [self.list_of_tags[l] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]

        results = self.metric.compute(predictions=true_predictions, references=true_labels)
        return {
            "precision": results["overall_precision"],
            "recall": results["overall_recall"],
            "f1": results["overall_f1"],
            "accuracy": results["overall_accuracy"],
        }