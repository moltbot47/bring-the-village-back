from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", include("core.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/waitlist/", include("waitlist.urls")),
    path("api/donations/", include("donations.urls")),
    path("api/matches/", include("matching.urls")),
    path("api/timebank/", include("timebank.urls")),
    path("api/messages/", include("messaging.urls")),
    path("api/community/", include("community.urls")),
    path("api/feedback/", include("feedback.urls")),
]
