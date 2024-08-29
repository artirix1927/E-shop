# Generated by Django 5.0.6 on 2024-08-23 17:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0004_remove_cartitem_ordered_alter_order_items'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='items',
        ),
        migrations.AddField(
            model_name='orderitem',
            name='order',
            field=models.ForeignKey(default=11, on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='cart.order'),
            preserve_default=False,
        ),
    ]