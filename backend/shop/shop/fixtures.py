import pytest
from django.contrib.auth.models import User

import products.models as product_models
import cart.models as cart_models

from shop.schema import schema
from graphene_django.utils.testing import graphql_query


@pytest.fixture
def client_query(client):
    def func(*args, **kwargs):
        return graphql_query(*args, **kwargs, client=client)

    return func


@pytest.fixture
def user():
    user_data = {"username": "volleyy11",
                 "password": "admin2281337",
                 "email": "gg@gmail.com"}
    u = User.objects.create_user(**user_data)
    return u


@pytest.fixture
def phone_category():
    c = product_models.Category.objects.create(name="Phones", shortname="phns")
    return c


@pytest.fixture
def accessory_category():
    c = product_models.Category.objects.create(
        name="Accessories", shortname="accssrs")
    return c


@pytest.fixture
def first_product(phone_category):
    producut_data = {
        "name": "Iphone 15",
        "price": 2999.00,
        "pieces_left": 1,
        "description": "Basically 13 iphone but more expensive!",
        "category": phone_category,
        "weight": 1.1}

    first_product = product_models.Product.objects.create(**producut_data)
    first_product.save()
    return first_product


@pytest.fixture
def second_product(accessory_category):
    producut_data = {
        "name": "Iphone 15 case",
        "price": 100.00,
        "pieces_left": 2,
        "description": "Case",
        "category": accessory_category,
        "weight": 0.1}

    second_product = product_models.Product.objects.create(**producut_data)
    second_product.save()
    return second_product


@pytest.fixture
def first_cart_item(first_product, user):
    cart_item = cart_models.CartItem.objects.create(
        user=user, product=first_product, quantity=1)
    return cart_item


@pytest.fixture
def second_cart_item(second_product, user):
    cart_item = cart_models.CartItem.objects.create(
        user=user, product=second_product, quantity=2)
    return cart_item
