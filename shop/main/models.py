from django.db import models

# Create your models here.

class Category(models.Model):
    '''Category for product model'''
    name = models.TextField(max_length=20, null=False)
    shortname = models.TextField(max_length=10, null=False, unique=True)
    description = models.TextField(max_length=256, blank=True)


    class Meta:
        verbose_name_plural = "Categories"
    
    
class Attachment(models.Model):
    '''The model enables stroing mutlitple images in one field in django'''
    image = models.ImageField()
    product = models.ForeignKey('Product', on_delete=models.CASCADE)

class Product(models.Model):
    name = models.TextField(max_length=80, null=False)

    price = models.FloatField()
    pieces_left = models.IntegerField()

    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    created_at = models.DateTimeField(auto_now_add=True)
    last_edited_at = models.DateTimeField(auto_now=True)

    weight = models.FloatField()







