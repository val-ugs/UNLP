from django.urls import path
from .views import hugging_face_model_view

app_name = 'nlp'

urlpatterns = [
    path('hugging-face-models/', hugging_face_model_view.HuggingFaceModelView.as_view(), name='hugging-face-models'),
    path('hugging-face-models/<int:pk>/', hugging_face_model_view.HuggingFaceModelView.as_view(), name='hugging-face-models-pk'),
    path('hugging-face-models/<int:hugging_face_model_pk>/train', hugging_face_model_view.train, name='hugging-face-models-train'),
    path('hugging-face-models/<int:hugging_face_model_pk>/predict/nlp-datasets/<int:nlp_dataset_pk>/', hugging_face_model_view.predict, name='hugging-face-models-predict'),
]
