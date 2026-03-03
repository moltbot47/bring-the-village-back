import pytest

from matching.models import MatchConnection
from messaging.models import Conversation, Message


@pytest.mark.django_db
class TestMessaging:
    @pytest.fixture(autouse=True)
    def setup_connection(self, user, other_user):
        """Create a match connection so messaging is allowed."""
        ids = sorted([user.id, other_user.id])
        MatchConnection.objects.create(user_a_id=ids[0], user_b_id=ids[1])

    def test_send_message(self, auth_client, other_user):
        resp = auth_client.post(
            f"/api/messages/{other_user.id}/",
            data={"text": "Hello!"},
            content_type="application/json",
        )
        assert resp.status_code == 201
        assert resp.json()["text"] == "Hello!"
        assert Message.objects.count() == 1

    def test_get_messages(self, auth_client, user, other_user):
        ids = sorted([user.id, other_user.id])
        convo = Conversation.objects.create(user_a_id=ids[0], user_b_id=ids[1])
        Message.objects.create(conversation=convo, sender=user, text="Hey")
        Message.objects.create(conversation=convo, sender=other_user, text="Hi back")

        resp = auth_client.get(f"/api/messages/{other_user.id}/")
        assert resp.status_code == 200
        msgs = resp.json()["messages"]
        assert len(msgs) == 2

    def test_empty_message_rejected(self, auth_client, other_user):
        resp = auth_client.post(
            f"/api/messages/{other_user.id}/",
            data={"text": ""},
            content_type="application/json",
        )
        assert resp.status_code == 400

    def test_message_truncated(self, auth_client, other_user):
        long_text = "x" * 3000
        resp = auth_client.post(
            f"/api/messages/{other_user.id}/",
            data={"text": long_text},
            content_type="application/json",
        )
        assert resp.status_code == 201
        msg = Message.objects.first()
        assert len(msg.text) == 2000

    def test_conversations_list(self, auth_client, user, other_user):
        ids = sorted([user.id, other_user.id])
        convo = Conversation.objects.create(user_a_id=ids[0], user_b_id=ids[1])
        Message.objects.create(conversation=convo, sender=other_user, text="Hey")

        resp = auth_client.get("/api/messages/")
        assert resp.status_code == 200
        convos = resp.json()["conversations"]
        assert len(convos) == 1
        assert convos[0]["unread_count"] == 1

    def test_reading_marks_as_read(self, auth_client, user, other_user):
        ids = sorted([user.id, other_user.id])
        convo = Conversation.objects.create(user_a_id=ids[0], user_b_id=ids[1])
        Message.objects.create(conversation=convo, sender=other_user, text="Hey")

        auth_client.get(f"/api/messages/{other_user.id}/")
        assert Message.objects.filter(is_read=False).count() == 0


@pytest.mark.django_db
class TestMessagingAuthorization:
    def test_requires_auth(self, anon_client, other_user):
        resp = anon_client.get(f"/api/messages/{other_user.id}/")
        assert resp.status_code == 403

    def test_requires_match_connection(self, auth_client, other_user):
        """Cannot message someone you're not matched with."""
        resp = auth_client.post(
            f"/api/messages/{other_user.id}/",
            data={"text": "Hello!"},
            content_type="application/json",
        )
        assert resp.status_code == 403
