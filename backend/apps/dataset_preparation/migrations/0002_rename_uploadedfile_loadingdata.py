# Generated by Django 5.0.1 on 2024-01-16 23:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dataset_preparation', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UploadedFile',
            new_name='LoadingData',
        ),
    ]
