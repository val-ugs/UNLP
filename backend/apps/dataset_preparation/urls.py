from django.urls import path
from .views import nlp_dataset_view, nlp_text_view

app_name = 'dataset_preparation'

urlpatterns = [
    path('nlp-dataset/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset'),
    path('nlp-dataset/<int:pk>/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset-pk'),
    path('nlp-text/', nlp_text_view.NlpTextView.as_view(), name='nlp-text'),
    path('nlp-text/<int:pk>/', nlp_text_view.NlpTextView.as_view(), name='nlp-text-pk')
]
