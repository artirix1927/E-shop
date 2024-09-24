from django.db import models

# Create your models here.


class AvailableCountries(models.Model):
    name = models.TextField(null=False)

    class Meta:
        verbose_name_plural = "Available countries"

    def __str__(self) -> str:
        return f"{self.name}"
