from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .engine import compute_match_scores
from .models import MatchConnection, MatchRequest
from .serializers import MatchRequestSerializer, MatchScoreSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def suggestions_view(request):
    """Get top 10 match suggestions for the current user."""
    profile = request.user.profile
    if not profile.is_onboarded:
        return Response({"detail": "Complete your profile first."}, status=status.HTTP_400_BAD_REQUEST)

    scores = compute_match_scores(profile, limit=10)
    serializer = MatchScoreSerializer(scores, many=True)
    return Response({"suggestions": serializer.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_request_view(request):
    """Send a match request to another parent."""
    to_user_id = request.data.get("to_user")
    message = request.data.get("message", "")

    if not to_user_id:
        return Response({"detail": "to_user is required."}, status=status.HTTP_400_BAD_REQUEST)

    if int(to_user_id) == request.user.id:
        return Response({"detail": "Cannot match with yourself."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if already requested or connected
    existing = MatchRequest.objects.filter(
        Q(from_user=request.user, to_user_id=to_user_id) | Q(from_user_id=to_user_id, to_user=request.user)
    ).first()

    if existing:
        return Response(
            {"detail": "Match request already exists.", "status": existing.status},
            status=status.HTTP_409_CONFLICT,
        )

    match_request = MatchRequest.objects.create(
        from_user=request.user,
        to_user_id=to_user_id,
        message=message[:300],
    )
    serializer = MatchRequestSerializer(match_request)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def respond_request_view(request, request_id):
    """Accept or decline a match request."""
    try:
        match_request = MatchRequest.objects.get(id=request_id, to_user=request.user, status="pending")
    except MatchRequest.DoesNotExist:
        return Response({"detail": "Request not found."}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get("action")
    if action not in ("accept", "decline"):
        return Response({"detail": "action must be 'accept' or 'decline'."}, status=status.HTTP_400_BAD_REQUEST)

    if action == "accept":
        match_request.status = "accepted"
        match_request.save()
        # Create connection (order users by ID for consistency)
        user_ids = sorted([match_request.from_user_id, match_request.to_user_id])
        MatchConnection.objects.get_or_create(user_a_id=user_ids[0], user_b_id=user_ids[1])
        return Response({"detail": "Match accepted! You're now connected.", "status": "accepted"})
    else:
        match_request.status = "declined"
        match_request.save()
        return Response({"detail": "Match declined.", "status": "declined"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_requests_view(request):
    """Get incoming and outgoing match requests."""
    incoming = MatchRequest.objects.filter(to_user=request.user, status="pending").select_related("from_user__profile")
    outgoing = MatchRequest.objects.filter(from_user=request.user).select_related("to_user__profile")

    return Response({
        "incoming": MatchRequestSerializer(incoming, many=True).data,
        "outgoing": MatchRequestSerializer(outgoing, many=True).data,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_connections_view(request):
    """Get all active connections."""
    connections = MatchConnection.objects.filter(
        Q(user_a=request.user) | Q(user_b=request.user),
        is_active=True,
    ).select_related("user_a__profile", "user_b__profile")

    result = []
    for conn in connections:
        other_user = conn.user_b if conn.user_a_id == request.user.id else conn.user_a
        result.append({
            "id": conn.id,
            "user_id": other_user.id,
            "display_name": other_user.profile.display_name,
            "bio": other_user.profile.bio,
            "kids_ages": other_user.profile.kids_ages,
            "chapter": other_user.profile.chapter,
            "connected_at": conn.created_at,
        })

    return Response({"connections": result})
