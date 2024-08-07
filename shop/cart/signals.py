from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order


from django.conf import settings
from django.core.mail import send_mail


@receiver(post_save, sender=Order)
def send_order_email_to_user(sender,instance,created, **kwargs):
    subject = 'New Bytemart order!'
    message = f'Hi {instance.user.username}, thank you for buying at our place.'
    email_from =  settings.EMAIL_HOST_USER
    
    recipient_list = [instance.user.email,]

    if created:
        send_mail(subject, message, email_from, recipient_list=recipient_list,fail_silently=False)
       
    