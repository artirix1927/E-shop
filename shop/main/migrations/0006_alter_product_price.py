# Generated by Django 5.0.6 on 2024-06-23 02:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_order_items_alter_cartitem_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=6),
        ),
    ]
