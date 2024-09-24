from django.contrib import admin

from .models import Message, SupportTicket

# Register your models here.


class MessageAdmin(admin.ModelAdmin):
    pass


class SupportTicketAdmin(admin.ModelAdmin):
    pass


admin.site.register(Message, MessageAdmin)
admin.site.register(SupportTicket, SupportTicketAdmin)
