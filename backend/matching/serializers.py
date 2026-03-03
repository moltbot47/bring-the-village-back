from rest_framework import serializers

from accounts.serializers import ProfileSerializer

from .models import MatchRequest, MatchScore


class MatchScoreSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source="to_profile")

    class Meta:
        model = MatchScore
        fields = [
            "id", "profile", "total_score", "proximity_score",
            "age_overlap_score", "schedule_score", "needs_offers_score", "ai_reason",
        ]


class MatchRequestSerializer(serializers.ModelSerializer):
    from_user_name = serializers.CharField(source="from_user.profile.display_name", read_only=True)
    to_user_name = serializers.CharField(source="to_user.profile.display_name", read_only=True)

    class Meta:
        model = MatchRequest
        fields = ["id", "from_user", "to_user", "from_user_name", "to_user_name", "status", "message", "created_at"]
        read_only_fields = ["id", "from_user", "from_user_name", "to_user_name", "status", "created_at"]
