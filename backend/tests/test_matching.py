import pytest
from django.test import Client

from matching.models import MatchConnection, MatchRequest


@pytest.mark.django_db
class TestMatchRequests:
    def test_send_match_request(self, auth_client, other_user):
        resp = auth_client.post(
            "/api/matches/request/",
            data={"to_user": other_user.id, "message": "Let's connect!"},
            content_type="application/json",
        )
        assert resp.status_code == 201
        assert MatchRequest.objects.count() == 1

    def test_cannot_match_self(self, auth_client, user):
        resp = auth_client.post(
            "/api/matches/request/",
            data={"to_user": user.id},
            content_type="application/json",
        )
        assert resp.status_code == 400

    def test_duplicate_request_rejected(self, auth_client, other_user):
        auth_client.post(
            "/api/matches/request/",
            data={"to_user": other_user.id},
            content_type="application/json",
        )
        resp = auth_client.post(
            "/api/matches/request/",
            data={"to_user": other_user.id},
            content_type="application/json",
        )
        assert resp.status_code == 409

    def test_accept_match_creates_connection(self, user, other_user):
        req = MatchRequest.objects.create(
            from_user=other_user, to_user=user, message="Hi!"
        )
        client = Client()
        client.login(username=user.email, password="securepass123")
        resp = client.patch(
            f"/api/matches/request/{req.id}/respond/",
            data={"action": "accept"},
            content_type="application/json",
        )
        assert resp.status_code == 200
        assert MatchConnection.objects.count() == 1

    def test_decline_match(self, user, other_user):
        req = MatchRequest.objects.create(
            from_user=other_user, to_user=user, message="Hi!"
        )
        client = Client()
        client.login(username=user.email, password="securepass123")
        resp = client.patch(
            f"/api/matches/request/{req.id}/respond/",
            data={"action": "decline"},
            content_type="application/json",
        )
        assert resp.status_code == 200
        req.refresh_from_db()
        assert req.status == "declined"

    def test_invalid_action(self, user, other_user):
        req = MatchRequest.objects.create(
            from_user=other_user, to_user=user
        )
        client = Client()
        client.login(username=user.email, password="securepass123")
        resp = client.patch(
            f"/api/matches/request/{req.id}/respond/",
            data={"action": "maybe"},
            content_type="application/json",
        )
        assert resp.status_code == 400

    def test_my_requests(self, auth_client, user, other_user):
        MatchRequest.objects.create(from_user=user, to_user=other_user, message="outgoing")
        resp = auth_client.get("/api/matches/requests/")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["outgoing"]) == 1
        assert len(data["incoming"]) == 0


@pytest.mark.django_db
class TestMatchConnections:
    def test_my_connections(self, auth_client, user, other_user):
        ids = sorted([user.id, other_user.id])
        MatchConnection.objects.create(user_a_id=ids[0], user_b_id=ids[1])
        resp = auth_client.get("/api/matches/connections/")
        assert resp.status_code == 200
        data = resp.json()["connections"]
        assert len(data) == 1
        assert data[0]["display_name"] == "Other Parent"


@pytest.mark.django_db
class TestMatchSuggestions:
    def test_suggestions_requires_onboarded(self, user):
        user.profile.is_onboarded = False
        user.profile.save()
        client = Client()
        client.login(username=user.email, password="securepass123")
        resp = client.get("/api/matches/suggestions/")
        assert resp.status_code == 400

    def test_suggestions_requires_auth(self, anon_client):
        resp = anon_client.get("/api/matches/suggestions/")
        assert resp.status_code == 403
