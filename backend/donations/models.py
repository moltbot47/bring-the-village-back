from django.db import models

from core.models import TimestampedModel

TIER_CHOICES = [
    ("founding_member", "Founding Member — $25"),
    ("patron", "Village Patron — $50"),
    ("champion", "Village Champion — $100"),
    ("builder", "Village Builder — $250"),
]


class DonationRecord(TimestampedModel):
    donor_name = models.CharField(max_length=150, blank=True)
    donor_email = models.EmailField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    zeffy_reference = models.CharField(max_length=100, blank=True)
    is_sponsorship = models.BooleanField(default=False, help_text="Funds go to sponsorship pool")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.donor_name or 'Anonymous'} — ${self.amount} ({self.get_tier_display()})"
