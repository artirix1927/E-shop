# Generated by Django 5.0.6 on 2024-08-09 05:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_cartitem_ordered'),
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id',
                 models.BigAutoField(
                     auto_created=True,
                     primary_key=True,
                     serialize=False,
                     verbose_name='ID')),
                ('quantity',
                 models.IntegerField()),
                ('product',
                 models.ForeignKey(
                     on_delete=django.db.models.deletion.CASCADE,
                     to='products.product')),
                ('user',
                 models.ForeignKey(
                     blank=True,
                     on_delete=django.db.models.deletion.CASCADE,
                     related_name='order_items',
                     to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
