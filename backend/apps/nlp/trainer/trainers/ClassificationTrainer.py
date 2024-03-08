import os
import string
import numpy as np
import pandas as pd
from transformers import AutoModelForSequenceClassification, AutoTokenizer, DataCollatorWithPadding, Trainer, TrainingArguments, TrainerCallback
from apps.common.models import NlpDataset, NlpText
from apps.common.serializers import NlpTextSerializer
from apps.nlp.preparers.ClassificationPreparer import ClassificationPreparer
from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id
from evaluate import EvaluationModule
from typing import List

#  Importance!!! DataFrame has columns: 'text', 'labels'

class ClassificationTrainer:
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

        self.id2label, self.label2id = get_id2label_label2id(train_df["labels"].tolist())
        model = AutoModelForSequenceClassification.from_pretrained(
            pretrained_model_name_or_path=model_name_or_path,
            num_labels=len(self.id2label),
            id2label=self.id2label,
            label2id=self.label2id
        )

        tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=model_name_or_path)
        self.preparer = ClassificationPreparer(tokenizer, self.label2id)

        tokenized_train_dataset = self.preparer.get_dataset(train_df)
        tokenized_val_dataset = self.preparer.get_dataset(valid_df)

        data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

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
        test_dataset = self.preparer.get_dataset(test_df)
        predictions, label_ids, metrics = self.trainer.predict(test_dataset, metric_key_prefix='predict')

        predictions = np.argmax(predictions, axis=1)
        # print(predictions)
        for text_index, text_row in test_df.iterrows():
            classification_label = self.id2label[predictions[text_index]]
            nlp_text = NlpText.objects.get(id=text_row['id'])
            if not nlp_text.classification_label: #  set classification label if not defined
                # print(f'text id without classification_label: {nlp_text.id}')
                nlp_text.classification_label = classification_label
                nlp_text.save()

        return metrics
    
    def __validate_nlp_dataset(self, test_nlp_dataset):
        nlp_texts = NlpText.objects.filter(nlp_dataset=test_nlp_dataset)
        for nlp_text in nlp_texts:
            if nlp_text.classification_label:
                raise Exception('Test dataset has classifications labels.')

    def __compute_metrics(self, eval_pred):
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=1)
        return self.metric.compute(predictions=predictions, references=labels)