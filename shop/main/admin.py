from django.contrib import admin

from .models import Category,Attachment,Product, Order, CartItem

# Register your models here.

class AttachmentAdmin(admin.ModelAdmin):
    list_filter = ('product__name',)
    pass

class AttachmentInline(admin.StackedInline):
    model=Attachment

class ProductsInline(admin.StackedInline):
    model = Product

class CategoryAdmin(admin.ModelAdmin):
    pass
    #inlines = [ProductsInline]


class ProductAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    readonly_fields= ('created_at', 'last_edited_at')
    inlines=[AttachmentInline]


class OrderAdmin(admin.ModelAdmin):
    model=Order


class CartItemAdmin(admin.ModelAdmin):
    model = CartItem
    


admin.site.register(Category, CategoryAdmin)
admin.site.register(Attachment, AttachmentAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(CartItem, CartItemAdmin)