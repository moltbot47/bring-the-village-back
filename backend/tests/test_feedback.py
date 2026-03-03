import pytest
from django.test import Client

from feedback.ai_triage import _keyword_triage
from feedback.models import FeedbackItem


@pytest.mark.django_db
class TestFeedbackSubmission:
    def test_anonymous_feedback(self):
        client = Client()
        resp = client.post(
            "/api/feedback/",
            data={"text": "Love this platform!", "category": "praise"},
            content_type="application/json",
        )
        assert resp.status_code == 201
        assert FeedbackItem.objects.count() == 1
        item = FeedbackItem.objects.first()
        assert item.user is None
        assert item.text == "Love this platform!"

    def test_authenticated_feedback(self, auth_client, user):
        resp = auth_client.post(
            "/api/feedback/",
            data={"text": "Add dark mode please", "category": "feature"},
            content_type="application/json",
        )
        assert resp.status_code == 201
        item = FeedbackItem.objects.first()
        assert item.user_id == user.id

    def test_empty_feedback_rejected(self):
        client = Client()
        resp = client.post(
            "/api/feedback/",
            data={"text": "", "category": "other"},
            content_type="application/json",
        )
        assert resp.status_code == 400

    def test_feedback_text_truncated(self):
        client = Client()
        long_text = "x" * 3000
        resp = client.post(
            "/api/feedback/",
            data={"text": long_text, "category": "other"},
            content_type="application/json",
        )
        assert resp.status_code == 201
        item = FeedbackItem.objects.first()
        assert len(item.text) == 2000


@pytest.mark.django_db
class TestFeedbackBoard:
    def test_empty_board(self):
        client = Client()
        resp = client.get("/api/feedback/board/")
        assert resp.status_code == 200
        assert resp.json()["feedback"] == []

    def test_only_reviewed_items_visible(self):
        FeedbackItem.objects.create(text="Hidden", status="new", ai_priority=1)
        FeedbackItem.objects.create(text="Visible", status="reviewed", ai_summary="Test", ai_priority=2)
        client = Client()
        resp = client.get("/api/feedback/board/")
        items = resp.json()["feedback"]
        assert len(items) == 1
        assert items[0]["status"] == "reviewed"


@pytest.mark.django_db
class TestFeedbackUpvote:
    def test_upvote(self, auth_client):
        item = FeedbackItem.objects.create(text="Great idea", status="reviewed", ai_priority=2)
        resp = auth_client.post(f"/api/feedback/{item.id}/upvote/")
        assert resp.status_code == 200
        item.refresh_from_db()
        assert item.upvotes == 1

    def test_duplicate_upvote_rejected(self, auth_client):
        item = FeedbackItem.objects.create(text="Great idea", status="reviewed", ai_priority=2)
        auth_client.post(f"/api/feedback/{item.id}/upvote/")
        resp = auth_client.post(f"/api/feedback/{item.id}/upvote/")
        assert resp.status_code == 409

    def test_upvote_requires_auth(self, anon_client):
        item = FeedbackItem.objects.create(text="Test", ai_priority=1)
        resp = anon_client.post(f"/api/feedback/{item.id}/upvote/")
        assert resp.status_code == 403


class TestKeywordTriage:
    def test_safety_keywords(self):
        result = _keyword_triage("I feel unsafe, someone was abusive")
        assert result["category"] == "safety"
        assert result["priority"] == 5

    def test_bug_keywords(self):
        result = _keyword_triage("The page is broken and crashes")
        assert result["category"] == "bug"
        assert result["priority"] == 4

    def test_praise_keywords(self):
        result = _keyword_triage("I love this platform, amazing work!")
        assert result["category"] == "praise"
        assert result["priority"] == 1

    def test_feature_keywords(self):
        result = _keyword_triage("I wish you would add a calendar feature")
        assert result["category"] == "feature"
        assert result["priority"] == 2

    def test_ux_keywords(self):
        result = _keyword_triage("The design is confusing and hard to navigate")
        assert result["category"] == "ux"
        assert result["priority"] == 2

    def test_generic_fallback(self):
        result = _keyword_triage("random thoughts about the platform")
        assert result["category"] == "other"
        assert result["priority"] == 2
