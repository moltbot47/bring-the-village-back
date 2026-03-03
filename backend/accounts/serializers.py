from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ParentProfile

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = ParentProfile
        fields = [
            "id",
            "email",
            "display_name",
            "bio",
            "zip_code",
            "chapter",
            "kids_ages",
            "needs",
            "offers",
            "availability",
            "photo_url",
            "is_onboarded",
            "is_sponsor_eligible",
            "created_at",
        ]
        read_only_fields = ["id", "email", "is_sponsor_eligible", "created_at"]


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    display_name = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=10)
    kids_ages = serializers.CharField(max_length=100)
    chapter = serializers.ChoiceField(choices=["houston", "austin", "dallas"], default="houston")

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data.pop("password")
        display_name = validated_data.pop("display_name")
        zip_code = validated_data.pop("zip_code")
        kids_ages = validated_data.pop("kids_ages")
        chapter = validated_data.pop("chapter")

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )

        ParentProfile.objects.create(
            user=user,
            display_name=display_name,
            zip_code=zip_code,
            kids_ages=kids_ages,
            chapter=chapter,
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
