from django.urls import path
from .views import ner_label_view, nlp_dataset_view, nlp_text_view, nlp_token_view

app_name = 'dataset_preparation'

urlpatterns = [
    path('ner-label/', ner_label_view.NerLabelView.as_view(), name='ner-label'),
    path('ner-label/<int:pk>/', ner_label_view.NerLabelView.as_view(), name='ner-label-pk'),
    path('nlp-dataset/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset'),
    path('nlp-dataset/<int:pk>/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset-pk'),
    path('nlp-text/', nlp_text_view.NlpTextView.as_view(), name='nlp-text'),
    path('nlp-text/<int:pk>/', nlp_text_view.NlpTextView.as_view(), name='nlp-text-pk'),
    path('nlp-token/', nlp_token_view.NlpTokenView.as_view(), name='nlp-token'),
    path('nlp-token/<int:pk>/', nlp_token_view.NlpTokenView.as_view(), name='nlp-token-pk')
]
