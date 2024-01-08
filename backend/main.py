# from tests.ClassificationTrainerTests import classification_trainer_bert_run

# classification_trainer_bert_run()


from load_ner_datasets import get_ner_corpus_dataset
from models.DataType import DataType

from transformers import AutoTokenizer, DataCollatorForTokenClassification, TrainingArguments
import evaluate
from services.NerTrainer import NerTrainer

from services.Preparation import Preparation

train_df = get_ner_corpus_dataset(dataType=DataType.Train)
val_df = get_ner_corpus_dataset(dataType=DataType.Val)
test_df = get_ner_corpus_dataset(dataType=DataType.Test)

# Configuration
model_name_or_path = "bert-base-uncased"

# Training args
output_model_name = "my_output_ner_model_name"

# Evaluate
evaluate_metric_name = 'seqeval'

metric = evaluate.load(evaluate_metric_name)

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

trainer = NerTrainer(
    model_name_or_path=model_name_or_path,
    training_args=training_args,
    metric=metric,
    train_df=train_df,
    val_df=val_df
)

trainer = NerTrainer(
    model_name_or_path=model_name_or_path,
    training_args=training_args,
    metric=metric,
    train_df=train_df,
    val_df=val_df
)

# trainer = NerTrainer(
#     model_name_or_path='./my_bert_ner_model/',
#     training_args=training_args,
#     metric=metric,
#     train_df=train_df,
#     val_df=val_df
# )

# Training
trainer.train('./my_bert_ner_model/')

# Predicting
trainer.predict(test_df)