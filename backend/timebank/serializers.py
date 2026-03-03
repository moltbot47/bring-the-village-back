from rest_framework import serializers

from .models import TimeCredit


class TimeCreditSerializer(serializers.ModelSerializer):
    giver_name = serializers.CharField(source="giver.profile.display_name", read_only=True)
    receiver_name = serializers.CharField(
        source="receiver.profile.display_name", read_only=True
    )

    class Meta:
        model = TimeCredit
        fields = [
            "id", "giver", "receiver", "giver_name", "receiver_name",
            "hours", "category", "description", "date",
            "confirmed_by_receiver", "created_at",
        ]
        read_only_fields = ["id", "giver", "giver_name", "receiver_name", "confirmed_by_receiver", "created_at"]
