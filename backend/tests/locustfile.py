"""
Load testing with Locust.

Run:  locust -f tests/locustfile.py --host http://localhost:8000
Then open http://localhost:8089 to configure and start the test.
"""

import random
import string

from locust import HttpUser, between, task


def random_email():
    suffix = "".join(random.choices(string.ascii_lowercase, k=8))
    return f"loadtest_{suffix}@example.com"


class AnonymousUser(HttpUser):
    """Simulates unauthenticated visitors hitting public endpoints."""

    weight = 3
    wait_time = between(1, 3)

    @task(5)
    def health_check(self):
        self.client.get("/api/health/")

    @task(3)
    def health_detail(self):
        self.client.get("/api/health/detail/")

    @task(2)
    def waitlist_count(self):
        self.client.get("/api/waitlist/count/")

    @task(2)
    def feedback_board(self):
        self.client.get("/api/feedback/board/")

    @task(1)
    def join_waitlist(self):
        self.client.post(
            "/api/waitlist/",
            json={
                "email": random_email(),
                "full_name": "Load Test Parent",
                "zip_code": "77001",
                "kids_ages": "5, 8",
                "needs": "Childcare help",
                "offers": "Tutoring",
                "chapter": "houston",
            },
        )

    @task(1)
    def submit_feedback(self):
        self.client.post(
            "/api/feedback/",
            json={
                "text": "Load test feedback submission",
                "category": "other",
            },
        )


class AuthenticatedUser(HttpUser):
    """Simulates logged-in parents using core features."""

    weight = 1
    wait_time = between(2, 5)

    def on_start(self):
        """Register and login a test user."""
        email = random_email()
        self.client.post(
            "/api/auth/register/",
            json={
                "email": email,
                "password": "loadtest1234",
                "display_name": "Load Tester",
                "zip_code": "77001",
                "kids_ages": "3, 7",
                "chapter": "houston",
            },
        )

    @task(3)
    def get_profile(self):
        self.client.get("/api/auth/me/")

    @task(2)
    def get_matches(self):
        self.client.get("/api/matches/suggestions/")

    @task(2)
    def get_conversations(self):
        self.client.get("/api/messages/")

    @task(2)
    def get_timebank_balance(self):
        self.client.get("/api/timebank/balance/")

    @task(1)
    def get_match_requests(self):
        self.client.get("/api/matches/requests/")

    @task(1)
    def get_connections(self):
        self.client.get("/api/matches/connections/")

    @task(1)
    def get_timebank_history(self):
        self.client.get("/api/timebank/history/")
