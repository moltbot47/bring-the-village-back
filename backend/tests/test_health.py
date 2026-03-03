import pytest
from django.test import Client


@pytest.mark.django_db
class TestHealthEndpoint:
    def test_health_returns_ok(self):
        client = Client()
        resp = client.get("/api/health/")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"

    def test_health_detail_returns_checks(self):
        client = Client()
        resp = client.get("/api/health/detail/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["version"] == "0.1.0"
        assert data["checks"]["database"] == "ok"
        assert data["checks"]["app"] == "ok"


@pytest.mark.django_db
class TestOpenAPISchema:
    def test_schema_endpoint(self):
        client = Client()
        resp = client.get("/api/schema/")
        assert resp.status_code == 200

    def test_docs_endpoint(self):
        client = Client()
        resp = client.get("/api/docs/")
        assert resp.status_code == 200
