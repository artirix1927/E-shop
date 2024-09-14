from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

from django.contrib.auth.models import User

from django.db.models import Sum

from django.db.models import F

from products.models import Product

from django_lifecycle import LifecycleModel, AFTER_CREATE, hook
from django.conf import settings


from cart.kafka_producer import send_email_to_kafka

# Create your models here.
DATE_FORMAT = '%d/%m/%Y'


class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cart_items",
        blank=True)
    # ordered = models.BooleanField(default=False) #dont need it if i will
    # create order item model

    def __str__(self) -> str:
        return f'Cart Item #{self.id} :{self.product.name}({self.quantity}) => {self.user.username}'


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="order_items",
        blank=True)
    order = models.ForeignKey(
        'Order',
        on_delete=models.CASCADE,
        related_name="order_items")
    # shipped = boolean ?

    def __str__(self) -> str:
        return f'Order Item #{self.id} : {self.product.name}({self.quantity}) => {self.user.username}'


# class Order(models.Model):
#     full_name = models.TextField(null=False)
#     phone_number = PhoneNumberField(null=False)

#     country = models.TextField(null=False)
#     state = models.TextField(null=False)
#     city = models.TextField(null=False)
#     adress = models.TextField(null=False)
#     postal_code = models.TextField(null=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     user = models.ForeignKey(
#         User,
#         related_name="orders",
#         on_delete=models.CASCADE)

#     def order_total_price(self) -> float:
#         sum_for_each_item = self.order_items.all().annotate(
#             sum=F('product__price') * F('quantity'))

#         sum_for_all = sum_for_each_item.aggregate(total_sum=Sum('sum'))

#         return sum_for_all.get('total_sum')

#     def __str__(self) -> str:
#         return f"{
#             self.user.username} ({
#             self.order_items.count()} items) : {
#             self.order_total_price()} : {
#                 str(
#                     self.created_at.strftime(DATE_FORMAT))}"

class Order(LifecycleModel):
    full_name = models.TextField(null=False)
    phone_number = PhoneNumberField(null=False)

    country = models.TextField(null=False)
    state = models.TextField(null=False)
    city = models.TextField(null=False)
    adress = models.TextField(null=False)
    postal_code = models.TextField(null=False)

    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        User,
        related_name="orders",
        on_delete=models.CASCADE)

    def order_total_price(self) -> float:
        sum_for_each_item = self.order_items.all().annotate(
            sum=F('product__price') * F('quantity'))

        sum_for_all = sum_for_each_item.aggregate(total_sum=Sum('sum'))

        return sum_for_all.get('total_sum')

    def __str__(self) -> str:
        return f"{
            self.user.username} ({
            self.order_items.count()} items) : {
            self.order_total_price()} : {
                str(
                    self.created_at.strftime(DATE_FORMAT))}"


    @hook(AFTER_CREATE)
    def on_order_create_send_email(self):
        
        subject = 'New Bytemart order!'
        message = f'Hi {
            self.user.username}, thank you for buying at our place.'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [self.user.email,]
        
        
        email_data = {
            'subject':subject,
            'message':message,
            'email_from':email_from,
            'recipient_list':recipient_list,
        }
      
        send_email_to_kafka(email_data)