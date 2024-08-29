from difflib import SequenceMatcher
from typing import Sequence
from django.db.models import QuerySet
# from .models import CartItem, OrderItem

import cart.models as db_models

def exclude_from_dict(dict: dict, keys_to_exclude:tuple) -> dict:
    dict_copy = dict.copy()
    for key in keys_to_exclude:
        dict_copy.pop(key)
    return dict_copy


def get_cart_items_by_ids (id_sequence: Sequence) -> QuerySet[db_models.CartItem]:
    return db_models.CartItem.objects.filter(pk__in=id_sequence)


def adjust_cart_item_quantity_to_pieces_left(user_cart_items: QuerySet[db_models.CartItem]) -> QuerySet[db_models.CartItem]:
    for item in user_cart_items:
        if item.quantity > item.product.pieces_left:
            item.quantity = item.product.pieces_left
            item.save()
    return user_cart_items


def create_order_items_for_cart_items(items:QuerySet[db_models.CartItem], order: db_models.Order) -> list[db_models.OrderItem]:
    return [db_models.OrderItem.objects.create(
                                        product=item.product, 
                                        quantity=item.quantity, 
                                        user=item.user,
                                        order=order) 
            for item in items]
    
    
def change_product_pieces_left_after_order(items:QuerySet[db_models.OrderItem]) -> QuerySet[db_models.OrderItem]:
    for item in items:
        item.product.pieces_left -= item.quantity
        
    return items