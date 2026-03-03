from django.conf import settings
from django.db import models

from core.models import TimestampedModel

CHAPTER_CHOICES = [
    ("houston", "Houston"),
    ("austin", "Austin"),
    ("dallas", "Dallas"),
]

AVAILABILITY_CHOICES = [
    ("weekday_morning", "Weekday Mornings"),
    ("weekday_afternoon", "Weekday Afternoons"),
    ("weekday_evening", "Weekday Evenings"),
    ("weekend_morning", "Weekend Mornings"),
    ("weekend_afternoon", "Weekend Afternoons"),
    ("weekend_evening", "Weekend Evenings"),
]


class ParentProfile(TimestampedModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    display_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, max_length=500)
    zip_code = models.CharField(max_length=10)
    chapter = models.CharField(max_length=20, choices=CHAPTER_CHOICES, default="houston")
    kids_ages = models.CharField(max_length=100, help_text="Comma-separated ages, e.g. 3, 7, 11")
    needs = models.TextField(blank=True, help_text="What kind of help do you need?")
    offers = models.TextField(blank=True, help_text="What can you offer to others?")
    availability = models.JSONField(default=list, blank=True, help_text="List of availability slots")
    photo_url = models.URLField(blank=True)
    is_onboarded = models.BooleanField(default=False)
    is_sponsor_eligible = models.BooleanField(default=False, help_text="Eligible for sponsorship pool subsidy")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.display_name} ({self.user.email})"
