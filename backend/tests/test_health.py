import pytest
from django.test import Client


@pytest.mark.django_db
class TestHealthEndpoint:
    def test_health_returns_ok(self):
        client = Client()
        resp = client.get("/api/health/")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"
