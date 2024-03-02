from django.shortcuts import get_object_or_404
from apps.common.models import NlpDataset
from apps.nlp.models import ModelType

from apps.nlp.models import HuggingFaceModel, ModelType, TrainingArgs
from apps.nlp.trainer.trainers.ClassificationTrainer import ClassificationTrainer
from apps.nlp.trainer.trainers.NerTrainer import NerTrainer

import evaluate
import os

from apps.nlp.utils.convert_nlp_dataset_to_df import convert_nlp_dataset_to_df
from apps.nlp.utils.convert_training_args_to_training_arguments import convert_training_args_to_training_arguments

from transformers import TrainerCallback

NLP_FOLDER_NAME = "trained_models"

class MyCallback(TrainerCallback):
    "A callback that prints info about Trainer"
    "Write method or something to get information"
    "For example steps of train and predict"

    # TODO on every step write info in database to create Counter
    #def on_step_begin(self, args, state, control, **kwargs):
        #print("next step")
        #print(kwargs['model'].classifier.out_proj.weight.grad.norm())

class CommonTrainer:
    def __init__(self, hugging_face_model: HuggingFaceModel):
        output_dir=f"{NLP_FOLDER_NAME}\{hugging_face_model.type}\{hugging_face_model.train_nlp_dataset.pk}"

        # if trained model exist - take it
        if os.path.exists(output_dir) and os.listdir(output_dir):
            hugging_face_model.model_name_or_path = output_dir

        training_args = get_object_or_404(TrainingArgs, hugging_face_model=hugging_face_model)
        training_arguments = convert_training_args_to_training_arguments(output_dir, training_args)
        train_df = convert_nlp_dataset_to_df(hugging_face_model.train_nlp_dataset)
        valid_df = convert_nlp_dataset_to_df(hugging_face_model.valid_nlp_dataset)
        metric = evaluate.load(hugging_face_model.evaluate_metric_name) # 'accuracy' for classification, 'seqeval' for ner

        match hugging_face_model.type:
            case ModelType.CLASSIFICATION:
                self.trainer = ClassificationTrainer(
                    model_name_or_path=hugging_face_model.model_name_or_path,
                    training_args=training_arguments,
                    metric=metric,
                    train_df=train_df,
                    val_df=valid_df,
                    output_dir=output_dir,
                    callbacks=[MyCallback]
                )
            case ModelType.NER:
                self.trainer = NerTrainer(
                    model_name_or_path=hugging_face_model.model_name_or_path,
                    training_args=training_arguments,
                    metric=metric,
                    train_df=train_df,
                    val_df=valid_df,
                    output_dir=output_dir,
                    callbacks=[MyCallback]
                )

    def train(self):
        log_history = self.trainer.train()
        return log_history

    def predict(self, test_nlp_dataset: NlpDataset):
        test_df = convert_nlp_dataset_to_df(test_nlp_dataset)
        self.trainer.predict(test_df)