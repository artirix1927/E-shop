from django.db import models

from phonenumber_field.modelfields import PhoneNumberField 

from django.contrib.auth.models import User

from django.db.models import QuerySet,Sum

from django.utils.html import mark_safe

from django.db.models import F


# Create your models here.

DATE_FORMAT = '%d/%m/%Y'



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
    


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items", blank=True)

    def __str__(self) -> str:
        return f'{self.product.name}({self.quantity}) => {self.user.username}'


class Order(models.Model):
    full_name = models.TextField(null=False)
    phone_number = PhoneNumberField(null=False)

    country = models.TextField(null=False)
    state = models.TextField(null=False)
    city = models.TextField(null=False)
    adress = models.TextField(null=False)
    postal_code = models.TextField(null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    
    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
    items = models.ManyToManyField('CartItem')

    def order_total_price(self) -> float:
        sum_for_each_item = self.items.all().annotate(sum=F('product__price')*F('quantity'))

        sum_for_all = sum_for_each_item.aggregate(total_sum=Sum('sum'))
        
        return sum_for_all.get('total_sum')

    def __str__(self) -> str:
        return f"{self.user.username} ({self.items.count()} items) : {self.order_total_price()} : {str(self.created_at.strftime(DATE_FORMAT))}"
    


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




class AvailableCountries(models.Model):
    name = models.TextField(null=False)

    class Meta:
        verbose_name_plural = "Available countries"

    def __str__(self) -> str:
        return f"{self.name}"
    
'''TODO:
    available characteristic + characteristic model +-

    available countries table +-
'''









