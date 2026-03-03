from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Event, EventRSVP


@api_view(["GET"])
@permission_classes([AllowAny])
def events_list(request):
    """List upcoming events, optionally filtered by chapter."""
    chapter = request.query_params.get("chapter")
    qs = Event.objects.filter(date__gte=timezone.now())
    if chapter:
        qs = qs.filter(chapter=chapter)

    events = []
    for e in qs.select_related("created_by__profile")[:20]:
        events.append({
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "chapter": e.chapter,
            "event_type": e.event_type,
            "date": e.date,
            "location": e.location,
            "max_attendees": e.max_attendees,
            "rsvp_count": e.rsvps.count(),
            "zeffy_ticket_url": e.zeffy_ticket_url,
            "created_by": e.created_by.profile.display_name,
        })

    return Response({"events": events})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    """Create a new community event."""
    data = request.data
    required = ["title", "description", "chapter", "event_type", "date", "location"]
    for field in required:
        if not data.get(field):
            return Response(
                {"detail": f"{field} is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    event = Event.objects.create(
        title=data["title"][:200],
        description=data["description"][:1000],
        chapter=data["chapter"],
        event_type=data["event_type"],
        date=data["date"],
        location=data["location"][:300],
        max_attendees=int(data.get("max_attendees", 0)),
        zeffy_ticket_url=data.get("zeffy_ticket_url", ""),
        created_by=request.user,
    )

    return Response({"id": event.id, "title": event.title}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rsvp_event(request, event_id):
    """RSVP to an event."""
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response(
            {"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND
        )

    if event.max_attendees > 0 and event.rsvps.count() >= event.max_attendees:
        return Response(
            {"detail": "Event is full."}, status=status.HTTP_409_CONFLICT
        )

    _, created = EventRSVP.objects.get_or_create(event=event, user=request.user)
    if created:
        return Response({"detail": "RSVP confirmed!", "rsvp_count": event.rsvps.count()})
    return Response({"detail": "Already RSVP'd."}, status=status.HTTP_409_CONFLICT)
