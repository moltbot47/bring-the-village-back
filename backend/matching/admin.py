from django.contrib import admin

from .models import MatchConnection, MatchRequest, MatchScore


@admin.register(MatchScore)
class MatchScoreAdmin(admin.ModelAdmin):
    list_display = ["from_profile", "to_profile", "total_score", "ai_reason", "created_at"]
    list_filter = ["created_at"]


@admin.register(MatchRequest)
class MatchRequestAdmin(admin.ModelAdmin):
    list_display = ["from_user", "to_user", "status", "created_at"]
    list_filter = ["status"]


@admin.register(MatchConnection)
class MatchConnectionAdmin(admin.ModelAdmin):
    list_display = ["user_a", "user_b", "is_active", "created_at"]
    list_filter = ["is_active"]
