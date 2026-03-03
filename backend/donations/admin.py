from django.contrib import admin

from .models import DonationRecord


@admin.register(DonationRecord)
class DonationRecordAdmin(admin.ModelAdmin):
    list_display = ["donor_name", "amount", "tier", "is_sponsorship", "created_at"]
    list_filter = ["tier", "is_sponsorship", "created_at"]
    search_fields = ["donor_name", "donor_email"]
    readonly_fields = ["created_at", "updated_at"]
