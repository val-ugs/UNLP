import os
import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer, DataCollatorWithPadding, Trainer
from services.Preparation import Preparation
from utils.get_id2label_label2id import get_id2label_label2id

class ClassificationTrainer:
    def __init__(self, model_name_or_path, training_args, metric, train_df, val_df):
        self.metric = metric
        self.train_df = train_df

        self.id2label, self.label2id = get_id2label_label2id(train_df["labels"].tolist())
        model = AutoModelForSequenceClassification.from_pretrained(
            pretrained_model_name_or_path=model_name_or_path,
            num_labels=len(self.id2label),
            id2label=self.id2label,
            label2id=self.label2id
        )

        tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=model_name_or_path)
        self.preparation = Preparation(tokenizer)

        data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
        tokenized_train_dataset = self.preparation.get_dataset(train_df)
        tokenized_val_dataset = self.preparation.get_dataset(val_df)

        self.trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=tokenized_train_dataset,
            eval_dataset=tokenized_val_dataset,
            tokenizer=tokenizer,
            data_collator=data_collator,
            compute_metrics=self.__compute_metrics,
        )
        self.output_dir = training_args.output_dir

    def train(self, path_to_model):
        self.trainer.train()
        if path_to_model:
            self.trainer.save_model(path_to_model)

    def predict(self, test_df):
        test_dataset = self.preparation.get_dataset(test_df)
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