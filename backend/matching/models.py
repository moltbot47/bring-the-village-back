from django.conf import settings
from django.db import models

from core.models import TimestampedModel

STATUS_CHOICES = [
    ("pending", "Pending"),
    ("accepted", "Accepted"),
    ("declined", "Declined"),
]


class MatchScore(TimestampedModel):
    """Cached compatibility score between two profiles."""

    from_profile = models.ForeignKey("accounts.ParentProfile", on_delete=models.CASCADE, related_name="scores_given")
    to_profile = models.ForeignKey("accounts.ParentProfile", on_delete=models.CASCADE, related_name="scores_received")
    proximity_score = models.FloatField(default=0, help_text="0-1 based on zip code distance")
    age_overlap_score = models.FloatField(default=0, help_text="0-1 based on kids age overlap")
    schedule_score = models.FloatField(default=0, help_text="0-1 based on availability overlap")
    needs_offers_score = models.FloatField(default=0, help_text="0-1 AI semantic match of needs↔offers")
    total_score = models.FloatField(default=0)
    ai_reason = models.TextField(blank=True, help_text="AI-generated one-liner explaining the match")

    class Meta:
        unique_together = ["from_profile", "to_profile"]
        ordering = ["-total_score"]

    def __str__(self):
        return f"{self.from_profile} → {self.to_profile} ({self.total_score:.0%})"


class MatchRequest(TimestampedModel):
    """A parent requests to connect with another parent."""

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="match_requests_sent"
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="match_requests_received"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    message = models.TextField(blank=True, max_length=300, help_text="Intro message to the other parent")

    class Meta:
        unique_together = ["from_user", "to_user"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.from_user} → {self.to_user} ({self.status})"


class MatchConnection(TimestampedModel):
    """Accepted match — two parents are now connected."""

    user_a = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connections_as_a")
    user_b = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="connections_as_b")
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ["user_a", "user_b"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_a} ↔ {self.user_b}"
