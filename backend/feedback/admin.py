from django.contrib import admin

from .models import FeedbackItem, FeedbackVote


@admin.register(FeedbackItem)
class FeedbackItemAdmin(admin.ModelAdmin):
    list_display = [
        "ai_summary", "ai_category", "ai_priority",
        "status", "upvotes", "user", "created_at",
    ]
    list_filter = ["ai_category", "status", "ai_priority"]
    list_editable = ["status"]
    search_fields = ["text", "ai_summary"]
    readonly_fields = ["ai_category", "ai_summary", "ai_priority", "upvotes"]


@admin.register(FeedbackVote)
class FeedbackVoteAdmin(admin.ModelAdmin):
    list_display = ["user", "feedback", "created_at"]
