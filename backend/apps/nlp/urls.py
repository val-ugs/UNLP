from django.urls import path
from .views import classification_model_view, ner_model_view

app_name = 'nlp'

urlpatterns = [
    path('classification-model/train/', classification_model_view.classification_model_train, name='classification-model-train'),
    path('classification-model/predict/', classification_model_view.classification_model_predict, name='classification-model-predict'),
    path('ner-model/train/', ner_model_view.ner_model_train, name='ner-model-train'),
    path('ner-model/predict/', ner_model_view.ner_model_predict, name='ner-model-predict'),
]
