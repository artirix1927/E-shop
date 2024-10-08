# Generated by Django 5.0.6 on 2024-07-01 03:28

import django.db.models.deletion
import products.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AvailableCharacteristics',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=24)),
            ],
            options={
                'verbose_name_plural': 'Available characteristics',
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=20)),
                ('shortname', models.TextField(max_length=10, unique=True)),
                ('description', models.TextField(blank=True, max_length=256)),
            ],
            options={
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=80)),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('pieces_left', models.IntegerField()),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('last_edited_at', models.DateTimeField(auto_now=True)),
                ('weight', models.FloatField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT,
                 related_name='products', to='products.category')),
            ],
        ),
        migrations.CreateModel(
            name='Characteristics',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.TextField()),
                ('characteristic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='characteristics', to='products.availablecharacteristics')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='characteristics', to='products.product')),
            ],
            options={
                'verbose_name_plural': 'Characteristics',
            },
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(
                    upload_to=products.models.Attachment.product_save_path)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='attachments', to='products.product')),
            ],
        ),
    ]
