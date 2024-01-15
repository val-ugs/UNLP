from django.urls import path
from .views import nlp_text_view

app_name = 'dataset_preparation'

urlpatterns = [
    path('nlp-text/', nlp_text_view.get, name='get-nlp-texts'),
    path('nlp-text/save/', nlp_text_view.save, name='save-nlp-texts'),
    path('nlp-text/tokenize/', nlp_text_view.tokenize, name='tokenize-nlp-texts'),
    path('nlp-text/<int:pk>/', nlp_text_view.update, name='update-nlp-text')
]
