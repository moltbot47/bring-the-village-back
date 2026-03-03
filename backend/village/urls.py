from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

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
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
]
