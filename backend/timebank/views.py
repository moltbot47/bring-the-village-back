from django.db.models import Q, Sum
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import TimeCredit
from .serializers import TimeCreditSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def balance_view(request):
    """Get time bank balance: hours given - hours received."""
    given = TimeCredit.objects.filter(
        giver=request.user, confirmed_by_receiver=True
    ).aggregate(total=Sum("hours"))["total"] or 0

    received = TimeCredit.objects.filter(
        receiver=request.user, confirmed_by_receiver=True
    ).aggregate(total=Sum("hours"))["total"] or 0

    return Response({
        "hours_given": float(given),
        "hours_received": float(received),
        "balance": float(given) - float(received),
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_time_view(request):
    """Log time given to another parent."""
    serializer = TimeCreditSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(giver=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def confirm_time_view(request, credit_id):
    """Receiver confirms the time credit."""
    try:
        credit = TimeCredit.objects.get(id=credit_id, receiver=request.user)
    except TimeCredit.DoesNotExist:
        return Response(
            {"detail": "Time credit not found."}, status=status.HTTP_404_NOT_FOUND
        )

    credit.confirmed_by_receiver = True
    credit.save()
    return Response({"detail": "Time confirmed.", "id": credit.id})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def history_view(request):
    """Get time credit history."""
    credits = TimeCredit.objects.filter(
        Q(giver=request.user) | Q(receiver=request.user)
    ).select_related("giver__profile", "receiver__profile")[:50]

    serializer = TimeCreditSerializer(credits, many=True)
    return Response({"history": serializer.data})
