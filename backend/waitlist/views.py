from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from .models import WaitlistEntry
from .serializers import WaitlistSerializer


class WaitlistCreateView(CreateAPIView):
    queryset = WaitlistEntry.objects.all()
    serializer_class = WaitlistSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "You're on the list! We'll be in touch soon.", "id": serializer.data["id"]},
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
def waitlist_count(request):
    count = WaitlistEntry.objects.count()
    return Response({"count": count})
