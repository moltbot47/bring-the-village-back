import pytest
from django.contrib.auth import get_user_model
from django.test import Client

from accounts.models import ParentProfile

User = get_user_model()


@pytest.mark.django_db
class TestRegistration:
    def test_register_creates_user_and_profile(self):
        client = Client()
        resp = client.post(
            "/api/auth/register/",
            data={
                "email": "new@example.com",
                "password": "securepass123",
                "display_name": "New Parent",
                "zip_code": "77001",
                "kids_ages": "4, 8",
                "chapter": "houston",
            },
            content_type="application/json",
        )
        assert resp.status_code == 201
        data = resp.json()["user"]
        assert data["email"] == "new@example.com"
        assert data["display_name"] == "New Parent"
        assert User.objects.count() == 1
        assert ParentProfile.objects.count() == 1

    def test_register_duplicate_email(self):
        client = Client()
        payload = {
            "email": "dupe@example.com",
            "password": "securepass123",
            "display_name": "First",
            "zip_code": "77001",
            "kids_ages": "3",
            "chapter": "houston",
        }
        client.post("/api/auth/register/", data=payload, content_type="application/json")
        resp = client.post("/api/auth/register/", data=payload, content_type="application/json")
        assert resp.status_code == 400

    def test_register_short_password(self):
        client = Client()
        resp = client.post(
            "/api/auth/register/",
            data={
                "email": "short@example.com",
                "password": "abc",
                "display_name": "Short",
                "zip_code": "77001",
                "kids_ages": "5",
                "chapter": "houston",
            },
            content_type="application/json",
        )
        assert resp.status_code == 400


@pytest.mark.django_db
class TestLogin:
    def test_login_success(self, user, user_data):
        client = Client()
        resp = client.post(
            "/api/auth/login/",
            data={"email": user_data["email"], "password": user_data["password"]},
            content_type="application/json",
        )
        assert resp.status_code == 200
        assert resp.json()["user"]["email"] == user_data["email"]

    def test_login_wrong_password(self, user, user_data):
        client = Client()
        resp = client.post(
            "/api/auth/login/",
            data={"email": user_data["email"], "password": "wrongpass"},
            content_type="application/json",
        )
        assert resp.status_code == 401

    def test_login_nonexistent_user(self):
        client = Client()
        resp = client.post(
            "/api/auth/login/",
            data={"email": "nobody@example.com", "password": "pass1234"},
            content_type="application/json",
        )
        assert resp.status_code == 401


@pytest.mark.django_db
class TestAuth:
    def test_me_authenticated(self, auth_client, user_data):
        resp = auth_client.get("/api/auth/me/")
        assert resp.status_code == 200
        assert resp.json()["user"]["email"] == user_data["email"]

    def test_me_unauthenticated(self, anon_client):
        resp = anon_client.get("/api/auth/me/")
        assert resp.status_code == 403

    def test_logout(self, auth_client):
        resp = auth_client.post("/api/auth/logout/")
        assert resp.status_code == 200
        # After logout, me should fail
        resp = auth_client.get("/api/auth/me/")
        assert resp.status_code == 403

    def test_update_profile(self, auth_client):
        resp = auth_client.patch(
            "/api/auth/me/update/",
            data={"bio": "Single mom of two", "needs": "Carpool help"},
            content_type="application/json",
        )
        assert resp.status_code == 200
        assert resp.json()["user"]["bio"] == "Single mom of two"

    def test_public_profile_view(self, anon_client, user):
        resp = anon_client.get(f"/api/auth/profile/{user.profile.id}/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["display_name"] == user.profile.display_name
        assert "email" not in data  # Email not exposed in public view
