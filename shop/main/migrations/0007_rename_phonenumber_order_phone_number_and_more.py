# Generated by Django 5.0.6 on 2024-06-25 01:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_product_price'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='phonenumber',
            new_name='phone_number',
        ),
        migrations.RenameField(
            model_name='order',
            old_name='postalcode',
            new_name='postal_code',
        ),
    ]