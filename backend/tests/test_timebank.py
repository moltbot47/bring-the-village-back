import pytest
from django.test import Client
from django.utils import timezone

from timebank.models import TimeCredit


@pytest.mark.django_db
class TestTimeBank:
    def test_balance_starts_zero(self, auth_client):
        resp = auth_client.get("/api/timebank/balance/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["hours_given"] == 0
        assert data["hours_received"] == 0
        assert data["balance"] == 0

    def test_log_time(self, auth_client, other_user):
        resp = auth_client.post(
            "/api/timebank/log/",
            data={
                "receiver": other_user.id,
                "hours": 2.5,
                "category": "childcare",
                "description": "Watched kids Saturday morning",
                "date": timezone.now().date().isoformat(),
            },
            content_type="application/json",
        )
        assert resp.status_code == 201
        assert TimeCredit.objects.count() == 1

    def test_confirm_time(self, user, other_user):
        credit = TimeCredit.objects.create(
            giver=user, receiver=other_user, hours=1.0, category="transportation",
            date=timezone.now().date(),
        )
        client = Client()
        client.login(username=other_user.email, password="securepass456")
        resp = client.patch(
            f"/api/timebank/confirm/{credit.id}/",
            content_type="application/json",
        )
        assert resp.status_code == 200
        credit.refresh_from_db()
        assert credit.confirmed_by_receiver is True

    def test_confirm_only_by_receiver(self, auth_client, user, other_user):
        credit = TimeCredit.objects.create(
            giver=user, receiver=other_user, hours=1.0, category="transportation",
            date=timezone.now().date(),
        )
        # auth_client is logged in as user (the giver), not the receiver
        resp = auth_client.patch(
            f"/api/timebank/confirm/{credit.id}/",
            content_type="application/json",
        )
        assert resp.status_code == 404

    def test_balance_after_confirmed(self, auth_client, user, other_user):
        TimeCredit.objects.create(
            giver=user, receiver=other_user, hours=3.0,
            category="childcare", confirmed_by_receiver=True,
            date=timezone.now().date(),
        )
        resp = auth_client.get("/api/timebank/balance/")
        data = resp.json()
        assert data["hours_given"] == 3.0
        assert data["balance"] == 3.0

    def test_history(self, auth_client, user, other_user):
        TimeCredit.objects.create(
            giver=user, receiver=other_user, hours=2.0, category="childcare",
            date=timezone.now().date(),
        )
        resp = auth_client.get("/api/timebank/history/")
        assert resp.status_code == 200
        assert len(resp.json()["history"]) == 1

    def test_requires_auth(self, anon_client):
        resp = anon_client.get("/api/timebank/balance/")
        assert resp.status_code == 403
