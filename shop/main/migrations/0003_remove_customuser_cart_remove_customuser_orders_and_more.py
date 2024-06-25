# Generated by Django 5.0.6 on 2024-06-14 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_order_alter_category_options_alter_attachment_image_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='cart',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='orders',
        ),
        migrations.AddField(
            model_name='customuser',
            name='cart',
            field=models.ManyToManyField(related_name='user', to='main.product'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='orders',
            field=models.ManyToManyField(related_name='user', to='main.order'),
        ),
    ]