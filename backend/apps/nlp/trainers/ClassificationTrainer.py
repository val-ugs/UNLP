import os
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer, DataCollatorWithPadding, Trainer
from apps.nlp.preparers.ClassificationPreparer import ClassificationPreparer
from apps.nlp.utils.get_id2label_label2id import get_id2label_label2id

#  Importance!!! DataFrame has columns: 'text', 'labels'

class ClassificationTrainer:
    def __init__(self, model_name_or_path, training_args, metric, train_df, val_df, output_dir):
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
        self.preparer = ClassificationPreparer(tokenizer)

        tokenized_train_dataset = self.preparer.get_dataset(train_df)
        tokenized_val_dataset = self.preparer.get_dataset(val_df)

        data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

        self.trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=tokenized_train_dataset,
            eval_dataset=tokenized_val_dataset,
            tokenizer=tokenizer,
            data_collator=data_collator,
            compute_metrics=self.__compute_metrics,
        )

    def train(self):
        self.trainer.train()
        self.trainer.save_model(self.output_dir)

    def predict(self, test_df):
        test_dataset = self.preparer.get_dataset(test_df)
        predictions, labels, metrics = self.trainer.predict(test_dataset, metric_key_prefix='predict')

        predictions = np.argmax(predictions, axis=1)
        output_predict_file = os.path.join(self.output_dir, "predictions.txt")
        prediction_labels = []
        if self.trainer.is_world_process_zero():
            with open(output_predict_file, "w") as writer:
                writer.write("index\tprediction\n")
                for index, item in enumerate(predictions):
                    item = self.id2label[item]
                    prediction_labels.append(item)
                    writer.write(f"{index}\t{item}\n")

        return prediction_labels

    def __compute_metrics(self, eval_pred):
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=1)
        return self.metric.compute(predictions=predictions, references=labels)