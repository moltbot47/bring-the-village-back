from django.urls import path

from . import views

urlpatterns = [
    path("", views.health, name="health"),
    path("detail/", views.health_detail, name="health-detail"),
]
