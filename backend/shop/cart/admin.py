from django.contrib import admin


from .models import CartItem, Order

from django.forms import Textarea
from django.db import models


# Register your models here.

class OrderAdmin(admin.ModelAdmin):
    list_filter = ('country', 'created_at')
    readonly_fields = ('created_at',)

    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 2,
                                  'cols': 80,
                                  'style': 'height: 1.5em;'})},
    }


class CartItemAdmin(admin.ModelAdmin):
    readonly_fields = ('user',)


admin.site.register(Order, OrderAdmin)
admin.site.register(CartItem, CartItemAdmin)
