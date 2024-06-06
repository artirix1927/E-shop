from django.contrib import admin

from .models import Category,Attachment,Product

# Register your models here.

class AttachmentAdmin(admin.ModelAdmin):
    pass


class ProductsInline(admin.StackedInline):
    model = Product

class CategoryAdmin(admin.ModelAdmin):
    inlines = [ProductsInline]

class AttachmentInline(admin.StackedInline):
    model=Attachment

class ProductAdmin(admin.ModelAdmin):
    inlines=[AttachmentInline]


admin.site.register(Category, CategoryAdmin)
admin.site.register(Attachment, AttachmentAdmin)
admin.site.register(Product, ProductAdmin)