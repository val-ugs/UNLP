# Generated by Django 5.0.1 on 2024-01-28 19:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NlpDataset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token_pattern_to_remove', models.CharField(blank=True, max_length=100, null=True)),
                ('token_pattern_to_split', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='NerLabel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=7)),
                ('nlp_dataset', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='common.nlpdataset')),
            ],
        ),
        migrations.CreateModel(
            name='NlpText',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('classification_label', models.CharField(blank=True, max_length=100, null=True)),
                ('nlp_dataset', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='common.nlpdataset')),
            ],
        ),
        migrations.CreateModel(
            name='NlpToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField(blank=True, null=True)),
                ('pos', models.IntegerField(null=True)),
                ('nlp_text', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='common.nlptext')),
            ],
        ),
        migrations.CreateModel(
            name='NlpTokenNerLabel',
            fields=[
                ('nlp_token', models.OneToOneField(blank=True, on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='common.nlptoken')),
                ('initial', models.BooleanField(default=True)),
                ('ner_label', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='common.nerlabel')),
            ],
        ),
    ]
