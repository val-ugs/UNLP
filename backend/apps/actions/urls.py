from django.urls import path
from .views import actions_view

app_name = 'actions'

urlpatterns = [
    path('copy/<int:nlp_dataset_pk>/', actions_view.copy_nlp_dataset, name='copy_nlp_dataset'),
    path('clear/<int:nlp_dataset_pk>/', actions_view.clear_nlp_dataset, name='clear_nlp_dataset'),
]
