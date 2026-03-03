from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ParentProfile
from .serializers import LoginSerializer, ProfileSerializer, RegisterSerializer


@api_view(["POST"])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    login(request, user)
    profile = ProfileSerializer(user.profile)
    return Response({"user": profile.data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = authenticate(
        request,
        username=serializer.validated_data["email"],
        password=serializer.validated_data["password"],
    )
    if user is None:
        return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)
    login(request, user)
    profile = ProfileSerializer(user.profile)
    return Response({"user": profile.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    profile = ProfileSerializer(request.user.profile)
    return Response({"user": profile.data})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    profile = request.user.profile
    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"user": serializer.data})


@api_view(["GET"])
def profile_detail_view(request, profile_id):
    """Public profile view — limited fields for non-authenticated or viewing other profiles."""
    try:
        profile = ParentProfile.objects.get(id=profile_id, is_onboarded=True)
    except ParentProfile.DoesNotExist:
        return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    data = {
        "id": profile.id,
        "display_name": profile.display_name,
        "bio": profile.bio,
        "chapter": profile.chapter,
        "kids_ages": profile.kids_ages,
        "needs": profile.needs,
        "offers": profile.offers,
        "availability": profile.availability,
        "photo_url": profile.photo_url,
    }
    return Response(data)
