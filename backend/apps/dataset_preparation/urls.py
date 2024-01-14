from django.urls import path
from . import views

app_name = 'dataset_preparation'

urlpatterns = [
    path('get-nlp-texts/', views.get_nlp_texts, name='get-nlp-texts'),
    path('save-nlp-texts/', views.save_nlp_texts, name='save-nlp-texts'),
    path('tokenize-nlp-texts/', views.tokenize_nlp_texts, name='tokenize-nlp-texts')
]
