from django.urls import path

from . import views

urlpatterns = [
    path("stats/", views.donation_stats, name="donation-stats"),
]
