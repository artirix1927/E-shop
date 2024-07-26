from django.db import models

from phonenumber_field.modelfields import PhoneNumberField 

from django.contrib.auth.models import User

from django.db.models import Sum

from django.db.models import F

from products.models import Product

# Create your models here.
DATE_FORMAT = '%d/%m/%Y'


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_items", blank=True)
    ordered = models.BooleanField(default=False)

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