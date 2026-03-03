from django.urls import path

from . import views

urlpatterns = [
    path("balance/", views.balance_view, name="timebank-balance"),
    path("log/", views.log_time_view, name="timebank-log"),
    path("confirm/<int:credit_id>/", views.confirm_time_view, name="timebank-confirm"),
    path("history/", views.history_view, name="timebank-history"),
]
