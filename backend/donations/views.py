from django.db.models import Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import DonationRecord


@api_view(["GET"])
def donation_stats(request):
    total = DonationRecord.objects.aggregate(total=Sum("amount"))["total"] or 0
    sponsor_pool = DonationRecord.objects.filter(is_sponsorship=True).aggregate(total=Sum("amount"))["total"] or 0
    count = DonationRecord.objects.count()
    return Response({
        "total_raised": float(total),
        "sponsor_pool": float(sponsor_pool),
        "donor_count": count,
    })
