from transformers import TrainingArguments
import evaluate

from load_classification_datasets import get_emotions_dataset
from models.DataType import DataType
from services.ClassificationTrainer import ClassificationTrainer

def classification_trainer_bert_run():
    # Configuration
    model_name_or_path = "bert-base-uncased"

    # Training args
    output_model_name = "my_output_classification_model_name"

    # Evaluate
    evaluate_metric_name = 'accuracy'

    train_df = get_emotions_dataset(dataType=DataType.Train)
    test_df = get_emotions_dataset(dataType=DataType.Test)
    val_df = get_emotions_dataset(dataType=DataType.Val)

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

    classification_trainer = ClassificationTrainer(
        model_name_or_path=model_name_or_path,
        training_args=training_args,
        metric=metric,
        train_df=train_df,
        val_df=val_df)

    # Load model from path
    # # classification_trainer = ClassificationTrainer(
    # #     model_name_or_path='./my_bert_classification_model/',
    # #     training_args=training_args,
    # #     metric=metric,
    # #     train_df=train_df,
    # #     val_df=val_df)

    # Training
    classification_trainer.train('./my_bert_classification_model/')
    
    # Predicting (with labels)
    predictions = classification_trainer.predict(test_df)
    for i in range(len(predictions)):
        print(f"{test_df['labels'][i]} : {predictions[i]}")

    # Custom Predicting (without labels)
    # # del test_df['labels']
    # # print(test_df.head(10))
    # # custom_predictions = classification_trainer.predict(test_df)

    # # for i in range(len(custom_predictions)):
    # #     print(f"{i + 1} sentence :{custom_predictions[i]}")