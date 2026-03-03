from django.contrib import admin

from .models import TimeCredit


@admin.register(TimeCredit)
class TimeCreditAdmin(admin.ModelAdmin):
    list_display = ["giver", "receiver", "hours", "category", "date", "confirmed_by_receiver"]
    list_filter = ["category", "confirmed_by_receiver", "date"]
