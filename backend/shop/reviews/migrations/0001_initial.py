# Generated by Django 5.0.6 on 2024-08-18 00:31

import django.db.models.deletion
import reviews.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('stars', models.IntegerField(choices=[
                 (1, 1), (2, 2), (3, 3), (4, 4), (5, 5)], default=5)),
                ('text', models.TextField()),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(
                    upload_to=reviews.models.Attachment.review_save_path)),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='attachments', to='reviews.review')),
            ],
        ),
    ]