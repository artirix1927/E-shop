from typing import Sequence
from django.db.models import  QuerySet
from .models import CartItem


def exclude_from_dict(dict: dict, keys_to_exclude:tuple) -> dict:
    dict_copy = dict.copy()
    for key in keys_to_exclude:
        dict_copy.pop(key)
    return dict_copy


def get_cart_items_by_ids (id_sequence: Sequence) -> QuerySet[CartItem]:
    return CartItem.objects.filter(pk__in=id_sequence)


def adjust_cart_item_quantity_to_pieces_left(user_cart_items: QuerySet[CartItem]) -> QuerySet[CartItem]:
    for item in user_cart_items:
        if item.quantity > item.product.pieces_left:
            item.quantity = item.product.pieces_left
            item.save()
    return user_cart_items
