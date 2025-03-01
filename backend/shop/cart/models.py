from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

from django.contrib.auth.models import User

from django.db.models import Sum

from django.db.models import F

from streaming_logic.produce import send_email_to_streaming
from products.models import Product

from django_lifecycle import LifecycleModel, AFTER_CREATE, hook
from django.conf import settings

from typing import Self, Sequence
from django.db.models import QuerySet
# from .models import CartItem, OrderItem


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

    @classmethod
    def get_cart_items_by_ids(cls,
                              id_sequence: Sequence) -> QuerySet[Self]:
        return CartItem.objects.filter(pk__in=id_sequence)

    @classmethod
    def adjust_cart_item_quantity_to_pieces_left(cls, user_cart_items: QuerySet[Self]) -> QuerySet[Self]:
        for item in user_cart_items:
            if item.quantity > item.product.pieces_left:
                item.quantity = item.product.pieces_left
                item.save()
        return user_cart_items

    @classmethod
    def create_order_items_for_cart_items(cls, items: QuerySet[Self], order: 'Order') -> list['OrderItem']:
        return [OrderItem.objects.create(
            product=item.product,
            quantity=item.quantity,
            user=item.user,
            order=order)
            for item in items]

    @classmethod
    def change_product_pieces_left_after_order(cls, items: QuerySet['OrderItem']) -> QuerySet['OrderItem']:
        for item in items:
            item.product.pieces_left -= item.quantity

        return items

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
            'subject': subject,
            'message': message,
            'email_from': email_from,
            'recipient_list': recipient_list,
        }

        send_email_to_streaming(email_data)
