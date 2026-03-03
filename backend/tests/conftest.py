import pytest
from django.contrib.auth import get_user_model
from django.test import Client

from accounts.models import ParentProfile

User = get_user_model()


@pytest.fixture
def user_data():
    return {
        "email": "test@example.com",
        "password": "securepass123",
        "display_name": "Test Parent",
        "zip_code": "77001",
        "kids_ages": "3, 7",
        "chapter": "houston",
    }


@pytest.fixture
def user(user_data):
    u = User.objects.create_user(
        username=user_data["email"],
        email=user_data["email"],
        password=user_data["password"],
    )
    ParentProfile.objects.create(
        user=u,
        display_name=user_data["display_name"],
        zip_code=user_data["zip_code"],
        kids_ages=user_data["kids_ages"],
        chapter=user_data["chapter"],
        is_onboarded=True,
    )
    return u


@pytest.fixture
def other_user():
    u = User.objects.create_user(
        username="other@example.com",
        email="other@example.com",
        password="securepass456",
    )
    ParentProfile.objects.create(
        user=u,
        display_name="Other Parent",
        zip_code="77002",
        kids_ages="5, 10",
        chapter="houston",
        needs="After-school pickup",
        offers="Weekend babysitting",
        is_onboarded=True,
    )
    return u


@pytest.fixture
def auth_client(user):
    client = Client()
    client.login(username=user.email, password="securepass123")
    return client


@pytest.fixture
def anon_client():
    return Client()
