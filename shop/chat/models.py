from django.db import models

from django.contrib.auth.models import User

# Create your models here.


class SupportTicket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="support_tickets")
    closed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'Ticket {self.id} : {self.user.username}'


 

class Message(models.Model):
    sent_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    message = models.TextField()
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    datetime = models.DateTimeField(auto_now_add=True)


    def __str__(self) -> str:
        return f"{self.ticket.user.id} : {self.message}"