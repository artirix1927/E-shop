from django.db import models
from django.contrib.auth.models import User


class SupportTicket(models.Model):
    # Storing just the user ID (integer) rather than the full user
    user = models.IntegerField()
    closed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'Ticket {self.user} #{self.id}'


class Message(models.Model):
    # Storing just the user ID (integer) rather than the full user
    sent_by = models.IntegerField(null=False)
    message = models.TextField()
    ticket = models.ForeignKey(
        SupportTicket,
        on_delete=models.CASCADE,
        related_name='messages')
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{str(self.ticket)} -> {self.sent_by} : {self.message}"
