import os
import string
import numpy as np
import pandas as pd
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, DataCollatorForSeq2Seq, Seq2SeqTrainer, Seq2SeqTrainingArguments, TrainerCallback
from apps.common.models import NlpDataset, NlpText
from apps.common.serializers import NlpTextSerializer
from apps.nlp.preparers.SummarizationPreparer import SummarizationPreparer
from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id
from evaluate import EvaluationModule
from typing import List

#  Importance!!! DataFrame has columns: 'text', 'summary'

class SummarizationTrainer:
    def __init__(
            self, 
            model_name_or_path: string, 
            training_args: Seq2SeqTrainingArguments, 
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

        model = AutoModelForSeq2SeqLM.from_pretrained(pretrained_model_name_or_path=model_name_or_path)

        self.tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=model_name_or_path)
        self.preparer = SummarizationPreparer(self.tokenizer)

        tokenized_train_dataset = self.preparer.get_dataset(train_df)
        tokenized_val_dataset = self.preparer.get_dataset(valid_df)

        data_collator = DataCollatorForSeq2Seq(tokenizer=self.tokenizer)
        
        training_args.predict_with_generate = True # set generation parameter
        
        self.trainer = Seq2SeqTrainer(
            model=model,
            args=training_args,
            train_dataset=tokenized_train_dataset,
            eval_dataset=tokenized_val_dataset,
            tokenizer=self.tokenizer,
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
        predictions, labels, metrics = self.trainer.predict(test_dataset, metric_key_prefix='predict')

        decoded_preds = self.tokenizer.batch_decode(predictions, skip_special_tokens=True)
        # print(decoded_preds)
        for text_index, text_row in test_df.iterrows():
            summarization = decoded_preds[text_index]
            nlp_text = NlpText.objects.get(id=text_row['id'])
            if not nlp_text.summarization: #  set classification label if not defined
                # print(f'text id without summarization: {nlp_text.id}')
                nlp_text_serializer = NlpTextSerializer(instance=nlp_text, summarization=summarization)
                if nlp_text_serializer.is_valid():
                    nlp_text_serializer.save()            

        return metrics
    
    def __validate_nlp_dataset(self, test_nlp_dataset):
        nlp_texts = NlpText.objects.filter(nlp_dataset=test_nlp_dataset)
        for nlp_text in nlp_texts:
            if nlp_text.summarization:
                raise Exception('Test dataset has summarizations.')

    def __compute_metrics(self, eval_pred):
        predictions, labels = eval_pred
        decoded_preds = self.tokenizer.batch_decode(predictions, skip_special_tokens=True)
        labels = np.where(labels != -100, labels, self.tokenizer.pad_token_id)
        decoded_labels = self.tokenizer.batch_decode(labels, skip_special_tokens=True)

        result = self.metric.compute(predictions=decoded_preds, references=decoded_labels, use_stemmer=True)

        prediction_lens = [np.count_nonzero(pred != self.tokenizer.pad_token_id) for pred in predictions]
        result["gen_len"] = np.mean(prediction_lens)

        return {k: round(v, 4) for k, v in result.items()}