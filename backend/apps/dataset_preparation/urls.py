from django.urls import path
from . import views

app_name = 'dataset_preparation'

urlpatterns = [
    path('get-nlp-texts/', views.GetNlpTextsView.as_view(), name='get-nlp-texts'),
]
