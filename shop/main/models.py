from django.db import models

# Create your models here.

class Category(models.Model):
    '''Category for product model'''
    name = models.TextField(max_length=20, null=False)
    shortname = models.TextField(max_length=10, null=False, unique=True)
    description = models.TextField(max_length=256, blank=True)


    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self) -> str:
        return f"{self.name} : {self.shortname}"
    
    
class Attachment(models.Model):
    def product_save_path(instance, filename): 
        print(instance, filename)
        return 'images/product{0}/{1}'.format(instance.id, filename) 

    '''The model enables stroing mutlitple images in one field in django'''
    image = models.ImageField(upload_to=product_save_path)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='attachments')

    def __str__(self) -> str:
        return f"image {self.pk} : {self.product.name}"

class Product(models.Model):
    name = models.TextField(max_length=80, null=False)

    price = models.FloatField()
    pieces_left = models.IntegerField()

    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    created_at = models.DateTimeField(auto_now_add=True)
    last_edited_at = models.DateTimeField(auto_now=True)

    weight = models.FloatField()

    def __str__(self) -> str:
        return f"{self.name} : {self.price}\n{self.category.name}"







