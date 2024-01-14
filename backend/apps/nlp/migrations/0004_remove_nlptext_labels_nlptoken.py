# Generated by Django 5.0.1 on 2024-01-13 22:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nlp', '0003_label_remove_nlptext_labels_nlptext_labels'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='nlptext',
            name='labels',
        ),
        migrations.CreateModel(
            name='NlpToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField()),
                ('pos', models.IntegerField()),
                ('label', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='nlp.label')),
                ('text', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nlp.nlptext')),
            ],
        ),
    ]
