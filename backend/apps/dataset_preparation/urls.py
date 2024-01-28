from django.urls import path
from .views import ner_label_view, nlp_dataset_view, nlp_text_view, nlp_token_view, nlp_token_ner_label_view

app_name = 'dataset_preparation'

urlpatterns = [
    path('ner-labels/', ner_label_view.NerLabelView.as_view(), name='ner-labels'),
    path('ner-labels/<int:pk>/', ner_label_view.NerLabelView.as_view(), name='ner-labels-pk'),
    path('nlp-datasets/<int:nlp_dataset_pk>/ner-labels/', ner_label_view.NerLabelView.as_view(), name='nlp-datasets-ner-labels'),
    path('nlp-datasets/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-datasets'),
    path('nlp-datasets/<int:pk>/', nlp_dataset_view.NlpDatasetView.as_view(), name='nlp-datasets-pk'),
    path('nlp-datasets/<int:pk>/download', nlp_dataset_view.download_nlp_dataset, name='nlp-datasets-download'),
    path('nlp-texts/', nlp_text_view.NlpTextView.as_view(), name='nlp-texts'),
    path('nlp-texts/<int:pk>/', nlp_text_view.NlpTextView.as_view(), name='nlp-texts-pk'),
    path('nlp-datasets/<int:nlp_dataset_pk>/nlp-texts/', nlp_text_view.NlpTextView.as_view(), name='nlp-datasets-nlp-texts'),
    path('nlp-tokens/', nlp_token_view.NlpTokenView.as_view(), name='nlp-tokens'),
    path('nlp-tokens/<int:pk>/', nlp_token_view.NlpTokenView.as_view(), name='nlp-tokens-pk'),
    path('nlp-texts/<int:nlp_text_pk>/nlp-tokens/', nlp_token_view.NlpTokenView.as_view(), name='nlp-texts-nlp-tokens'),
    path('nlp-token-ner-labels/', nlp_token_ner_label_view.NlpTokenNerLabelView.as_view(), name='nlp-token-ner-labels'),
    path('nlp-tokens/<int:nlp_token_pk>/nlp-token-ner-labels/', nlp_token_ner_label_view.NlpTokenNerLabelView.as_view(), name='nlp-tokens-nlp-token-ner-labels'),
]
