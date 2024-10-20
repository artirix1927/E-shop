
# from .models import CartItem, OrderItem


def exclude_from_dict(dict: dict, keys_to_exclude: tuple) -> dict:
    dict_copy = dict.copy()
    for key in keys_to_exclude:
        dict_copy.pop(key)
    return dict_copy
