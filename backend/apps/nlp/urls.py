from django.urls import path
from . import views

urlpatterns = [
    path('get-classification-models/', views.get_classification_models),
    path('classification-model-train/', views.classification_model_train),
    path('classification-model-predict/', views.classification_model_predict),
    path('get-ner-models/', views.get_ner_models),
    path('ner-model-train/', views.ner_model_train),
    path('ner-model-predict/', views.ner_model_predict),
]
