from django.contrib import admin

from .models import Category,Attachment,Product, Order, CartItem, \
                    AvailableCharacteristics, Characteristics, AvailableCountries

from django.utils.html import mark_safe

from django.forms import Textarea
from django.db import models

# Register your models here.

class AttachmentAdmin(admin.ModelAdmin):

    def show_image(self, obj):
        return mark_safe('<img src="{url}" width="500" height="500" style="object-fit:contain"/>'.format(
            url = obj.image.url,
            width=obj.image.width,
            height=obj.image.height,
            )
    )
    fields = ('product', 'image','show_image')
    list_filter = ('product__name',)
    readonly_fields = ('show_image',)

    

    
  

class AttachmentInline(admin.StackedInline):
    model=Attachment

class ProductsInline(admin.StackedInline):
    model = Product

class CategoryAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 1,
                                  'cols': 80,
                                  'style': 'min-height: 1.5em;'})},
    }
    #inlines = [ProductsInline]


class ProductAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    readonly_fields= ('created_at', 'last_edited_at')
    inlines=[AttachmentInline]

    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 6,
                                  'cols': 80,
                                  'style': 'min-height: 1.5em;'})},
    }
    


class OrderAdmin(admin.ModelAdmin):
    list_filter = ('country','created_at')
    readonly_fields= ('created_at','user')

    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 2,
                                  'cols': 80,
                                  'style': 'height: 1.5em;'})},
    }
    

class CartItemAdmin(admin.ModelAdmin):
    readonly_fields= ('user',)

class CharacteristicsAdmin(admin.ModelAdmin):
    pass

class AvailableCharacteristicsAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 1,
                                  'cols': 80,
                                  'style': 'height: 1.5em;'})},
    }


class AvailableCountriesAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 1,
                                  'cols': 80,
                                  'style': 'height: 1.5em;'})},
    }
    


admin.site.register(Category, CategoryAdmin)
admin.site.register(Attachment, AttachmentAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(CartItem, CartItemAdmin)

admin.site.register(AvailableCharacteristics, AvailableCharacteristicsAdmin)
admin.site.register(Characteristics,CharacteristicsAdmin)
admin.site.register(AvailableCountries, AvailableCountriesAdmin)