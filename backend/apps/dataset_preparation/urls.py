from django.urls import path
from .views import ner_label_view, nlp_dataset_view, nlp_text_view, nlp_token_view

app_name = 'dataset_preparation'

urlpatterns = [
    path('ner-labels/', ner_label_view.NerLabelView.as_view(), name='ner-label'),
    path('ner-labels/<int:pk>/', ner_label_view.NerLabelView.as_view(), name='ner-label-pk'),
    path('nlp-datasets/<int:nlp_dataset_pk>/ner-labels/', ner_label_view.NerLabelView.as_view(), name='nlp-dataset-ner-label'),
    path('nlp-datasets/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset'),
    path('nlp-datasets/<int:pk>/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-dataset-pk'),
    path('nlp-texts/', nlp_text_view.NlpTextView.as_view(), name='nlp-text'),
    path('nlp-texts/<int:pk>/', nlp_text_view.NlpTextView.as_view(), name='nlp-text-pk'),
    path('nlp-tokens/', nlp_token_view.NlpTokenView.as_view(), name='nlp-token'),
    path('nlp-tokens/<int:pk>/', nlp_token_view.NlpTokenView.as_view(), name='nlp-token-pk')
]
