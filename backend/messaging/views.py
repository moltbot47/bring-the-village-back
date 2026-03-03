from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from matching.models import MatchConnection

from .models import Conversation, Message


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversations_view(request):
    """List all conversations for the current user."""
    convos = Conversation.objects.filter(
        Q(user_a=request.user) | Q(user_b=request.user)
    ).select_related("user_a__profile", "user_b__profile")

    result = []
    for c in convos:
        other = c.other_user(request.user)
        last_msg = c.messages.order_by("-created_at").first()
        unread = c.messages.filter(is_read=False).exclude(sender=request.user).count()
        result.append({
            "id": c.id,
            "other_user_id": other.id,
            "other_user_name": other.profile.display_name,
            "last_message": last_msg.text[:80] if last_msg else None,
            "last_message_at": last_msg.created_at if last_msg else c.created_at,
            "unread_count": unread,
        })

    result.sort(key=lambda x: x["last_message_at"], reverse=True)
    return Response({"conversations": result})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def messages_view(request, user_id):
    """GET messages with a user, or POST a new message."""
    # Verify users are matched before allowing conversation
    ids = sorted([request.user.id, user_id])
    is_connected = MatchConnection.objects.filter(
        user_a_id=ids[0], user_b_id=ids[1], is_active=True
    ).exists()
    if not is_connected:
        return Response(
            {"detail": "You can only message matched connections."},
            status=status.HTTP_403_FORBIDDEN,
        )

    convo, _ = Conversation.objects.get_or_create(
        user_a_id=ids[0], user_b_id=ids[1]
    )

    if request.method == "GET":
        # Mark messages as read
        convo.messages.filter(is_read=False).exclude(
            sender=request.user
        ).update(is_read=True)

        msgs = convo.messages.select_related("sender__profile")[:100]
        return Response({
            "messages": [
                {
                    "id": m.id,
                    "sender_id": m.sender_id,
                    "sender_name": m.sender.profile.display_name,
                    "text": m.text,
                    "is_mine": m.sender_id == request.user.id,
                    "created_at": m.created_at,
                }
                for m in msgs
            ]
        })

    # POST
    text = request.data.get("text", "").strip()
    if not text:
        return Response(
            {"detail": "Message text is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    msg = Message.objects.create(
        conversation=convo, sender=request.user, text=text[:2000]
    )
    convo.save()  # Update updated_at

    return Response({
        "id": msg.id,
        "sender_id": msg.sender_id,
        "text": msg.text,
        "created_at": msg.created_at,
    }, status=status.HTTP_201_CREATED)
