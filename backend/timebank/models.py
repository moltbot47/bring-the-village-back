from django.conf import settings
from django.db import models

from core.models import TimestampedModel

CATEGORY_CHOICES = [
    ("childcare", "Childcare"),
    ("cooking", "Cooking / Meal Prep"),
    ("cleaning", "Cleaning / Household"),
    ("tutoring", "Tutoring / Homework"),
    ("transportation", "Transportation"),
    ("errands", "Errands"),
    ("emotional", "Emotional Support"),
    ("other", "Other"),
]


class TimeCredit(TimestampedModel):
    """A record of time given or received between two connected parents."""

    giver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="time_given"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="time_received"
    )
    hours = models.DecimalField(max_digits=4, decimal_places=1)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=200, blank=True)
    date = models.DateField()
    confirmed_by_receiver = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.giver} → {self.receiver}: {self.hours}h ({self.category})"
