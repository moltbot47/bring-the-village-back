from django.db import models

from core.models import TimestampedModel

CHAPTER_CHOICES = [
    ("houston", "Houston"),
    ("austin", "Austin"),
    ("dallas", "Dallas"),
]


class WaitlistEntry(TimestampedModel):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    zip_code = models.CharField(max_length=10)
    kids_ages = models.CharField(max_length=100, help_text="Comma-separated ages, e.g. 3, 7, 11")
    needs = models.TextField(blank=True, help_text="What kind of help do you need?")
    offers = models.TextField(blank=True, help_text="What can you offer to others?")
    chapter = models.CharField(max_length=20, choices=CHAPTER_CHOICES, default="houston")
    source = models.CharField(max_length=50, default="website")

    class Meta:
        verbose_name_plural = "waitlist entries"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.email})"
