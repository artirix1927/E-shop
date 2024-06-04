from django.contrib import admin

from .models import Category,Attachment,Product

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    pass

class ProductAdmin(admin.ModelAdmin):
    pass

class AttachmentAdmin(admin.ModelAdmin):
    pass


admin.site.register(Category, CategoryAdmin)
admin.site.register(Attachment, AttachmentAdmin)
admin.site.register(Product, ProductAdmin)