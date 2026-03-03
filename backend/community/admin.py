from django.contrib import admin

from .models import Event, EventRSVP


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "chapter", "event_type", "date", "created_by"]
    list_filter = ["chapter", "event_type", "date"]


@admin.register(EventRSVP)
class EventRSVPAdmin(admin.ModelAdmin):
    list_display = ["user", "event", "created_at"]
