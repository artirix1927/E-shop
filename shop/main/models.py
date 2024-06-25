from django.db import models

from phonenumber_field.modelfields import PhoneNumberField 

from django.contrib.auth.models import User

from django.db.models import QuerySet

from django.utils.html import mark_safe

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
    


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items", blank=True)

    def __str__(self) -> str:
        return f'{self.product.name}({self.quantity}) => {self.user.username}'


class Order(models.Model):
    country = models.TextField(null=False)
    full_name = models.TextField(null=False)
    phone_number = PhoneNumberField(null=False)
    adress = models.TextField(null=False)
    city = models.TextField(null=False)
    postal_code = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name="orders", on_delete=models.CASCADE)
    items = models.ManyToManyField('CartItem')

    @staticmethod
    def order_total_price(cart_items: QuerySet[CartItem]) -> float:
        total_for_each_item = (item.product.price*item.quantity for item in cart_items)

        return sum(total_for_each_item)

    def __str__(self) -> str:
        order_sum = self.order_total_price(self.items.all())

        return f"{self.user.username} ({self.items.count()} items) : {order_sum} "
    
    


    










