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
    '''The model enables stroing mutlitple images in one field in django'''
    
    def product_save_path(instance, filename) -> str: 
        return 'images/product{0}/{1}'.format(instance.product.id, filename) 
    
    image = models.ImageField(upload_to=product_save_path)
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='attachments')



    def __str__(self) -> str:
        return f"image {self.pk} : {self.product.name}"

class Product(models.Model):
    name = models.TextField(max_length=80, null=False)

    price = models.DecimalField(max_digits=6, decimal_places=2)
    pieces_left = models.IntegerField()

    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')

    created_at = models.DateTimeField(auto_now_add=True)
    last_edited_at = models.DateTimeField(auto_now=True)

    weight = models.FloatField()

    def __str__(self) -> str:
        return f"{self.name} : {self.price}\n{self.category.name}"


class AvailableCharacteristics(models.Model):
    name = models.TextField(null=False, max_length=24)

    def __str__(self) -> str:
        return f"{self.name}"
    
    class Meta:
        verbose_name_plural = "Available characteristics"
    

class Characteristics(models.Model):
    characteristic = models.ForeignKey(AvailableCharacteristics, related_name="characteristics", on_delete=models.CASCADE)
    value = models.TextField(null=False)
    product = models.ForeignKey(Product, related_name="characteristics", on_delete=models.CASCADE)


    class Meta:
        verbose_name_plural = "Characteristics"

    def __str__(self) -> str:
        return f"{self.characteristic.name} : {self.value} => {self.product.name}"
    
