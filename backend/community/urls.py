from django.urls import path

from . import views

urlpatterns = [
    path("events/", views.events_list, name="events-list"),
    path("events/create/", views.create_event, name="events-create"),
    path("events/<int:event_id>/rsvp/", views.rsvp_event, name="events-rsvp"),
]
