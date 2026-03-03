import pytest
from django.test import Client

from waitlist.models import WaitlistEntry


@pytest.mark.django_db
class TestWaitlist:
    def test_join_waitlist(self):
        client = Client()
        resp = client.post(
            "/api/waitlist/",
            data={
                "email": "parent@example.com",
                "full_name": "Jane Doe",
                "zip_code": "77001",
                "kids_ages": "3, 7",
                "needs": "After-school pickup",
                "offers": "Weekend cooking",
                "chapter": "houston",
            },
            content_type="application/json",
        )
        assert resp.status_code == 201
        assert "id" in resp.json()
        assert WaitlistEntry.objects.count() == 1

    def test_duplicate_email_rejected(self):
        client = Client()
        data = {
            "email": "dupe@example.com",
            "full_name": "First",
            "zip_code": "77001",
            "kids_ages": "5",
            "chapter": "houston",
        }
        client.post("/api/waitlist/", data=data, content_type="application/json")
        resp = client.post("/api/waitlist/", data=data, content_type="application/json")
        assert resp.status_code == 400
        assert WaitlistEntry.objects.count() == 1

    def test_case_insensitive_email(self):
        client = Client()
        data = {
            "email": "Test@Example.COM",
            "full_name": "Test",
            "zip_code": "77001",
            "kids_ages": "5",
            "chapter": "houston",
        }
        client.post("/api/waitlist/", data=data, content_type="application/json")
        entry = WaitlistEntry.objects.first()
        assert entry.email == "test@example.com"

    def test_waitlist_count(self):
        client = Client()
        resp = client.get("/api/waitlist/count/")
        assert resp.status_code == 200
        assert resp.json()["count"] == 0

        WaitlistEntry.objects.create(
            email="a@b.com", full_name="A", zip_code="77001", kids_ages="5"
        )
        resp = client.get("/api/waitlist/count/")
        assert resp.json()["count"] == 1

    def test_missing_required_fields(self):
        client = Client()
        resp = client.post(
            "/api/waitlist/",
            data={"email": "test@example.com"},
            content_type="application/json",
        )
        assert resp.status_code == 400
