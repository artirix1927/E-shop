
from .models import Category
from django.db.models import Q


def get_category_by_dropdown_value(category_name: str) -> Q:
        category = Category.objects.filter(name=category_name).first()

        return Q(category=category) if category else Q()   
