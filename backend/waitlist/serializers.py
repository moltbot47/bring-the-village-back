from rest_framework import serializers

from .models import WaitlistEntry


class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaitlistEntry
        fields = ["id", "email", "full_name", "zip_code", "kids_ages", "needs", "offers", "chapter"]

    def validate_email(self, value):
        if WaitlistEntry.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already on the waitlist.")
        return value.lower()
