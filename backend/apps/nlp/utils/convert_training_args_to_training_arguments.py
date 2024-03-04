import torch
from transformers import TrainingArguments, Seq2SeqTrainingArguments 
def convert_training_args_to_training_arguments(output_dir, training_args):
    return TrainingArguments(
        output_dir=output_dir,
        learning_rate=training_args.learning_rate,
        per_device_train_batch_size=training_args.per_device_train_batch_size,
        per_device_eval_batch_size=training_args.per_device_eval_batch_size,
        num_train_epochs=training_args.num_train_epochs,
        weight_decay=training_args.weight_decay,
        evaluation_strategy=training_args.evaluation_strategy,
        save_strategy=training_args.save_strategy,
        load_best_model_at_end=training_args.load_best_model_at_end,
    )

def convert_training_args_to_seq_2_seq_training_arguments(output_dir, training_args):
    return Seq2SeqTrainingArguments(
        output_dir=output_dir,
        learning_rate=training_args.learning_rate,
        per_device_train_batch_size=training_args.per_device_train_batch_size,
        per_device_eval_batch_size=training_args.per_device_eval_batch_size,
        num_train_epochs=training_args.num_train_epochs,
        weight_decay=training_args.weight_decay,
        evaluation_strategy=training_args.evaluation_strategy,
        save_strategy=training_args.save_strategy,
        load_best_model_at_end=training_args.load_best_model_at_end,
    )