from django.db.models import F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .ai_triage import triage_feedback
from .models import FeedbackItem, FeedbackVote


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_feedback(request):
    """Submit feedback — works for anonymous and authenticated users."""
    text = request.data.get("text", "").strip()
    if not text:
        return Response(
            {"detail": "Feedback text is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    category = request.data.get("category", "other")
    email = request.data.get("email", "")

    # AI triage
    ai_result = triage_feedback(text)

    item = FeedbackItem.objects.create(
        user=request.user if request.user.is_authenticated else None,
        email=email,
        text=text[:2000],
        category=category,
        ai_category=ai_result["category"],
        ai_summary=ai_result["summary"],
        ai_priority=ai_result["priority"],
        source=request.data.get("source", "app"),
    )

    return Response({
        "id": item.id,
        "message": "Thank you for your feedback!",
        "category": ai_result["category"],
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_feedback(request):
    """Public feedback board — shows reviewed/planned items for transparency."""
    items = FeedbackItem.objects.filter(
        status__in=["reviewed", "planned", "done"]
    ).values(
        "id", "ai_summary", "ai_category", "status", "upvotes", "created_at"
    )[:50]

    return Response({"feedback": list(items)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upvote_feedback(request, feedback_id):
    """Upvote a feedback item. One vote per user."""
    try:
        item = FeedbackItem.objects.get(id=feedback_id)
    except FeedbackItem.DoesNotExist:
        return Response(
            {"detail": "Feedback not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    _, created = FeedbackVote.objects.get_or_create(
        user=request.user, feedback=item
    )

    if created:
        FeedbackItem.objects.filter(id=feedback_id).update(upvotes=F("upvotes") + 1)
        return Response({"detail": "Upvoted!", "upvotes": item.upvotes + 1})
    else:
        return Response(
            {"detail": "Already upvoted."},
            status=status.HTTP_409_CONFLICT,
        )
