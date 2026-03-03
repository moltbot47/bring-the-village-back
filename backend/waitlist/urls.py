from django.urls import path

from . import views

urlpatterns = [
    path("", views.WaitlistCreateView.as_view(), name="waitlist-create"),
    path("count/", views.waitlist_count, name="waitlist-count"),
]
