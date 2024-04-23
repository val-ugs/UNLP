from django.urls import path
from .views import actions_view

app_name = 'actions'

urlpatterns = [
    path('copy/<int:nlp_dataset_pk>/', actions_view.copy_nlp_dataset, name='copy_nlp_dataset'),
    path('clear/<int:nlp_dataset_pk>/', actions_view.clear_nlp_dataset, name='clear_nlp_dataset'),
    path('create-by-field/<int:nlp_dataset_pk>/', actions_view.create_dataset_by_field, name='create_dataset_by_field'),
    path('delete-texts-without-fields/<int:nlp_dataset_pk>/', actions_view.delete_texts_without_fields, name='delete_texts_without_fields'),
    path('create-nlp-token-ner-labels-by-pattern/<int:nlp_dataset_pk>/', actions_view.create_nlp_token_ner_labels_by_pattern, name='create_nlp_token_ner_labels_by_pattern'),
    path('create-nlp-dataset-by-template/', actions_view.create_nlp_dataset_by_template, name='create_nlp_dataset_by_template'),
]
