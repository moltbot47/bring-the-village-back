import pytest

from donations.models import DonationRecord
from feedback.models import FeedbackItem
from waitlist.models import WaitlistEntry


@pytest.mark.django_db
class TestWaitlistModel:
    def test_str(self):
        entry = WaitlistEntry.objects.create(
            email="test@example.com", full_name="Test Parent",
            zip_code="77001", kids_ages="5, 8",
        )
        assert str(entry) == "Test Parent (test@example.com)"

    def test_ordering(self):
        WaitlistEntry.objects.create(
            email="a@b.com", full_name="First", zip_code="77001", kids_ages="3"
        )
        WaitlistEntry.objects.create(
            email="b@b.com", full_name="Second", zip_code="77001", kids_ages="5"
        )
        entries = list(WaitlistEntry.objects.all())
        assert entries[0].full_name == "Second"  # Most recent first


@pytest.mark.django_db
class TestDonationModel:
    def test_str_named(self):
        d = DonationRecord.objects.create(
            donor_name="Jane", amount=25.00, tier="founding_member"
        )
        assert "Jane" in str(d)
        assert "$25" in str(d)

    def test_str_anonymous(self):
        d = DonationRecord.objects.create(amount=100.00, tier="champion")
        assert "Anonymous" in str(d)


@pytest.mark.django_db
class TestParentProfile:
    def test_str(self, user):
        assert user.email in str(user.profile)
        assert user.profile.display_name in str(user.profile)


@pytest.mark.django_db
class TestFeedbackModel:
    def test_str(self):
        item = FeedbackItem.objects.create(
            text="This is great feedback that is longer than sixty characters for truncation test",
            category="feature",
            ai_priority=2,
        )
        assert "[feature]" in str(item)
        assert len(str(item)) <= 80  # category bracket + truncated text

    def test_ordering_by_priority(self):
        FeedbackItem.objects.create(text="Low", ai_priority=1)
        FeedbackItem.objects.create(text="High", ai_priority=5)
        FeedbackItem.objects.create(text="Medium", ai_priority=3)
        items = list(FeedbackItem.objects.all())
        assert items[0].ai_priority == 5
        assert items[1].ai_priority == 3
        assert items[2].ai_priority == 1
