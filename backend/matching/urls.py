from django.urls import path

from . import views

urlpatterns = [
    path("suggestions/", views.suggestions_view, name="match-suggestions"),
    path("request/", views.send_request_view, name="match-request"),
    path("request/<int:request_id>/respond/", views.respond_request_view, name="match-respond"),
    path("requests/", views.my_requests_view, name="match-requests"),
    path("connections/", views.my_connections_view, name="match-connections"),
]
