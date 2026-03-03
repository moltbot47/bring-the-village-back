from django.contrib import admin

from .models import ParentProfile


@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ["display_name", "user", "chapter", "zip_code", "is_onboarded", "created_at"]
    list_filter = ["chapter", "is_onboarded", "is_sponsor_eligible"]
    search_fields = ["display_name", "user__email", "zip_code"]
    readonly_fields = ["created_at", "updated_at"]
