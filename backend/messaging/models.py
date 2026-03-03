from django.conf import settings
from django.db import models

from core.models import TimestampedModel


class Conversation(TimestampedModel):
    """Thread between two connected parents."""

    user_a = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_as_a"
    )
    user_b = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversations_as_b"
    )

    class Meta:
        unique_together = ["user_a", "user_b"]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Conversation: {self.user_a} ↔ {self.user_b}"

    def other_user(self, user):
        return self.user_b if self.user_a_id == user.id else self.user_a


class Message(TimestampedModel):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages"
    )
    text = models.TextField(max_length=2000)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender}: {self.text[:50]}"
