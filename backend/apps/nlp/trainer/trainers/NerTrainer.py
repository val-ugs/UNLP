import os
import numpy as np
from transformers import AutoModelForTokenClassification, AutoTokenizer, DataCollatorForTokenClassification, Trainer
from apps.nlp.preparers.NerPreparer import NerPreparer
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id

#  Importance!!! DataFrame has columns: 'text', 'labels'

class NerTrainer:
    def __init__(self, model_name_or_path, training_args, metric, train_df, val_df, output_dir, callbacks):
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
        tokenized_val_dataset = self.preparation.get_dataset(val_df)

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

    def predict(self, test_df):
        test_dataset = self.preparation.get_dataset(test_df)
        predictions, labels, metrics = self.trainer.predict(test_dataset, metric_key_prefix='predict')

        predictions = np.argmax(predictions, axis=2)

        # Remove ignored index (special tokens)
        true_predictions = [
            [self.id2label[p] for (p, l) in zip(prediction, label) if l != -100]
            for prediction, label in zip(predictions, labels)
        ]

        output_predict_file = os.path.join(self.output_dir, "predictions.txt")
        prediction_sentence_labels = []
        if self.trainer.is_world_process_zero():
            with open(output_predict_file, "w") as writer:
                for prediction in true_predictions:
                    writer.write(" ".join(prediction) + "\n")

        return prediction_sentence_labels

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