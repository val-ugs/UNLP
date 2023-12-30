from transformers import AutoTokenizer, DataCollatorWithPadding, AutoModelForSequenceClassification, TrainingArguments, Trainer
import evaluate
import numpy as np
import datasets

from load_classification_datasets import get_emotions_dataset
from models.DataType import DataType

def preprocess_function(examples):
    return tokenizer(examples["text"], truncation=True)

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    return accuracy.compute(predictions=predictions, references=labels)

def get_id2label_label2id(labels):
    id2label = {}
    label2id = {}
    for id, label in enumerate(sorted(set(labels))):
        id2label[id] = label
        label2id[label] = id
    return id2label, label2id

# Configuration
pretrained_model_name_or_path = "bert-base-uncased"

# Training args
output_model_name = "my_output_model_name"

# Preprocess
tokenizer_truncation = True

# Evaluate
evaluate_metric_name = 'accuracy'

train_df = get_emotions_dataset(dataType=DataType.Train)
test_df = get_emotions_dataset(dataType=DataType.Test)
val_df = get_emotions_dataset(dataType=DataType.Val)

id2label, label2id = get_id2label_label2id(train_df["labels"].tolist())

# Convert label to indices
train_df['labels'] = train_df['labels'].apply(lambda x: label2id[x])
test_df['labels'] = test_df['labels'].apply(lambda x: label2id[x])
val_df['labels'] = val_df['labels'].apply(lambda x: label2id[x])

train_dataset = datasets.Dataset.from_pandas(train_df)
test_dataset = datasets.Dataset.from_pandas(test_df)
val_dataset = datasets.Dataset.from_pandas(val_df)

tokenizer = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=pretrained_model_name_or_path)

tokenized_train_dataset = train_dataset.map(preprocess_function, batched=True)
tokenized_val_dataset = val_dataset.map(preprocess_function, batched=True)

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

accuracy = evaluate.load(evaluate_metric_name)

model = AutoModelForSequenceClassification.from_pretrained(
    pretrained_model_name_or_path=pretrained_model_name_or_path,
    num_labels=len(id2label),
    id2label=id2label,
    label2id=label2id
)

training_args = TrainingArguments(
    output_dir=output_model_name,
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=2,
    weight_decay=0.01,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train_dataset,
    eval_dataset=tokenized_val_dataset,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

# Training
train_result = trainer.train()
metrics = train_result.metrics