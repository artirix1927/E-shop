from django.apps import AppConfig
from django.db.models.signals import post_save



class CartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cart'
    
    def ready(self) -> None:
        import cart.signals
        # from cart.signals import send_order_email_to_user
        # from cart.models import Order
        # post_save.connect(send_order_email_to_user, sender=Order)