from django.urls import path

from . import views

urlpatterns = [
    path("", views.submit_feedback, name="submit-feedback"),
    path("board/", views.public_feedback, name="feedback-board"),
    path("<int:feedback_id>/upvote/", views.upvote_feedback, name="upvote-feedback"),
]
