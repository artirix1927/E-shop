
from django.db.models import QuerySet
from django.db.models import Q
from .models import Category,CartItem

import os


def delete_empty_dirs(path):
    if os.path.isdir(path) and not os.listdir(path):
        os.rmdir(path)
        parent_dir = os.path.dirname(path)
        delete_empty_dirs(parent_dir)


def adjust_cart_item_quantity_to_pieces_left(user_cart_items: QuerySet[CartItem]) -> QuerySet[CartItem]:
    for item in user_cart_items:
        if item.quantity > item.product.pieces_left:
            item.quantity = item.product.pieces_left
            item.save()
    return user_cart_items


def get_category_by_dropdown_value(category_name: str) -> Q:
        category = Category.objects.filter(name=category_name).first()

        return Q(category=category) if category else Q()   



def exclude_from_dict(dict: dict, keys_to_exclude:tuple) -> dict:
    dict_copy = dict.copy()
    for key in keys_to_exclude:
        dict_copy.pop(key)
    return dict_copy

