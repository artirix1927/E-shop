from django.contrib import admin

# Register your models here.
from django.forms import Textarea
from django.db import models

from .models import AvailableCountries


class AvailableCountriesAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.TextField: {'widget': Textarea(
                           attrs={'rows': 1,
                                  'cols': 80,
                                  'style': 'height: 1.5em;'})},
    }
    




admin.site.register(AvailableCountries, AvailableCountriesAdmin)