from rest_framework import serializers
from .models import LoadingData

class LoadingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoadingData
        fields = '__all__'