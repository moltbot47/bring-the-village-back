from django.contrib import admin

from .models import WaitlistEntry


@admin.register(WaitlistEntry)
class WaitlistEntryAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "zip_code", "chapter", "created_at"]
    list_filter = ["chapter", "created_at"]
    search_fields = ["full_name", "email", "zip_code"]
    readonly_fields = ["created_at", "updated_at"]
