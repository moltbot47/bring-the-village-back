from django.conf import settings
from django.db import models

from core.models import TimestampedModel

CHAPTER_CHOICES = [
    ("houston", "Houston"),
    ("austin", "Austin"),
    ("dallas", "Dallas"),
]

EVENT_TYPE_CHOICES = [
    ("playdate", "Playdate"),
    ("meetup", "Parent Meetup"),
    ("workshop", "Workshop"),
    ("zoo", "Zoo / Park Day"),
    ("potluck", "Potluck"),
    ("other", "Other"),
]


class Event(TimestampedModel):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=1000)
    chapter = models.CharField(max_length=20, choices=CHAPTER_CHOICES)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    date = models.DateTimeField()
    location = models.CharField(max_length=300)
    max_attendees = models.IntegerField(default=0, help_text="0 = unlimited")
    zeffy_ticket_url = models.URLField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="events_created"
    )

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.title} ({self.chapter}, {self.date:%Y-%m-%d})"


class EventRSVP(TimestampedModel):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="rsvps")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rsvps"
    )

    class Meta:
        unique_together = ["event", "user"]

    def __str__(self):
        return f"{self.user} → {self.event}"
