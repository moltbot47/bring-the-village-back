from django.conf import settings
from django.db import models

from core.models import TimestampedModel

CATEGORY_CHOICES = [
    ("bug", "Bug Report"),
    ("feature", "Feature Request"),
    ("safety", "Safety Concern"),
    ("ux", "UX / Design"),
    ("praise", "Praise / Testimonial"),
    ("other", "Other"),
]

STATUS_CHOICES = [
    ("new", "New"),
    ("reviewed", "Reviewed"),
    ("planned", "Planned"),
    ("done", "Done"),
    ("wont_fix", "Won't Fix"),
]


class FeedbackItem(TimestampedModel):
    """Lean feedback system — one table, AI-categorized, community upvoted."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    email = models.EmailField(blank=True, help_text="For anonymous feedback")
    text = models.TextField(max_length=2000)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
    ai_category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, blank=True,
        help_text="Auto-categorized by AI"
    )
    ai_summary = models.CharField(
        max_length=200, blank=True, help_text="AI one-line summary"
    )
    ai_priority = models.IntegerField(
        default=0, help_text="AI-assessed priority 1-5 (5=urgent)"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="new")
    upvotes = models.IntegerField(default=0)
    source = models.CharField(max_length=30, default="app")

    class Meta:
        ordering = ["-ai_priority", "-upvotes", "-created_at"]

    def __str__(self):
        return f"[{self.category}] {self.text[:60]}"


class FeedbackVote(TimestampedModel):
    """Track who upvoted what to prevent duplicates."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    feedback = models.ForeignKey(FeedbackItem, on_delete=models.CASCADE, related_name="votes")

    class Meta:
        unique_together = ["user", "feedback"]
