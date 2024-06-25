from django.contrib import admin

from .models import Category,Attachment,Product, Order, CartItem

from django.utils.html import mark_safe

# Register your models here.

class AttachmentAdmin(admin.ModelAdmin):

    def show_image(self, obj):
        return mark_safe('<img src="{url}" width="500" height="500" style="object-fit:contain"/>'.format(
            url = obj.image.url,
            width=obj.image.width,
            height=obj.image.height,
            )
    )

    model = Attachment
    fields = ('product', 'image','show_image')
    list_filter = ('product__name',)
    readonly_fields = ('show_image',)

    

    
  

class AttachmentInline(admin.StackedInline):
    model=Attachment

class ProductsInline(admin.StackedInline):
    model = Product

class CategoryAdmin(admin.ModelAdmin):
    pass
    #inlines = [ProductsInline]


class ProductAdmin(admin.ModelAdmin):
    list_filter = ('category',)
    readonly_fields= ('created_at', 'last_edited_at',)
    inlines=[AttachmentInline]
    


class OrderAdmin(admin.ModelAdmin):
    model=Order
    list_filter = ('country','created_at')
    readonly_fields= ('created_at','user')
    


class CartItemAdmin(admin.ModelAdmin):
    model = CartItem
    readonly_fields= ('user',)
    


admin.site.register(Category, CategoryAdmin)
admin.site.register(Attachment, AttachmentAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(CartItem, CartItemAdmin)