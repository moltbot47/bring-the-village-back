"""
Matching engine — scores compatibility between parent profiles.

Uses a weighted combination of:
  - Proximity (zip code prefix match, 30%)
  - Kids age overlap (20%)
  - Schedule compatibility (20%)
  - AI semantic needs↔offers match (30%)

The AI component uses Claude to understand nuanced compatibility:
  "I need childcare while studying" ↔ "I can watch kids on weekday evenings"
"""

import logging
import os
import re

from accounts.models import ParentProfile

from .models import MatchScore

logger = logging.getLogger(__name__)

# Weights for each scoring dimension
WEIGHTS = {
    "proximity": 0.30,
    "age_overlap": 0.20,
    "schedule": 0.20,
    "needs_offers": 0.30,
}


def parse_ages(ages_str: str) -> list[int]:
    """Parse '3, 7, 11' into [3, 7, 11]."""
    return [int(a.strip()) for a in re.split(r"[,\s]+", ages_str) if a.strip().isdigit()]


def proximity_score(zip_a: str, zip_b: str) -> float:
    """Score based on zip code prefix overlap. Same zip = 1.0, same 3-digit prefix = 0.7, etc."""
    if zip_a == zip_b:
        return 1.0
    if zip_a[:4] == zip_b[:4]:
        return 0.85
    if zip_a[:3] == zip_b[:3]:
        return 0.7
    if zip_a[:2] == zip_b[:2]:
        return 0.4
    return 0.1


def age_overlap_score(ages_a: str, ages_b: str) -> float:
    """Score based on how close the kids' ages are. Closer = better for playdates."""
    parsed_a = parse_ages(ages_a)
    parsed_b = parse_ages(ages_b)
    if not parsed_a or not parsed_b:
        return 0.3  # Unknown, give neutral

    # Find closest age pairs
    min_diffs = []
    for a in parsed_a:
        closest = min(abs(a - b) for b in parsed_b)
        min_diffs.append(closest)

    avg_diff = sum(min_diffs) / len(min_diffs)
    # 0 diff = 1.0, 5+ diff = 0.1
    return max(0.1, 1.0 - (avg_diff * 0.18))


def schedule_score(avail_a: list[str], avail_b: list[str]) -> float:
    """Score based on overlapping availability slots."""
    if not avail_a or not avail_b:
        return 0.5  # Unknown, neutral

    set_a = set(avail_a)
    set_b = set(avail_b)
    overlap = set_a & set_b
    union = set_a | set_b

    if not union:
        return 0.5

    return len(overlap) / len(union)


def ai_needs_offers_score(profile_a: ParentProfile, profile_b: ParentProfile) -> tuple[float, str]:
    """
    Use Claude API to score semantic compatibility between needs↔offers.
    Falls back to keyword matching if API key not set.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")

    if not api_key:
        # Fallback: simple keyword overlap
        return _keyword_fallback(profile_a, profile_b)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        prompt = f"""Score compatibility between these two single parents (0.0 to 1.0) \
based on how well their needs and offers complement each other.

Parent A:
- Needs: {profile_a.needs or 'Not specified'}
- Offers: {profile_a.offers or 'Not specified'}
- Kids ages: {profile_a.kids_ages}
- Availability: {', '.join(profile_a.availability) if profile_a.availability else 'Not specified'}

Parent B:
- Needs: {profile_b.needs or 'Not specified'}
- Offers: {profile_b.offers or 'Not specified'}
- Kids ages: {profile_b.kids_ages}
- Availability: {', '.join(profile_b.availability) if profile_b.availability else 'Not specified'}

Respond with ONLY a JSON object: {{"score": 0.X, "reason": "one short sentence"}}"""

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=100,
            messages=[{"role": "user", "content": prompt}],
        )

        import json

        text = response.content[0].text.strip()
        result = json.loads(text)
        return float(result["score"]), result["reason"]

    except Exception as e:
        logger.warning("AI matching failed, using fallback: %s", e)
        return _keyword_fallback(profile_a, profile_b)


def _keyword_fallback(profile_a: ParentProfile, profile_b: ParentProfile) -> tuple[float, str]:
    """Simple keyword overlap matching as fallback."""
    keywords_a_needs = set((profile_a.needs or "").lower().split())
    keywords_b_offers = set((profile_b.offers or "").lower().split())
    keywords_b_needs = set((profile_b.needs or "").lower().split())
    keywords_a_offers = set((profile_a.offers or "").lower().split())

    # How well B's offers match A's needs, and vice versa
    match_ab = len(keywords_a_needs & keywords_b_offers)
    match_ba = len(keywords_b_needs & keywords_a_offers)
    total_keywords = max(len(keywords_a_needs | keywords_b_needs), 1)

    score = min(1.0, (match_ab + match_ba) / total_keywords)
    reason = "Matched by shared keywords in needs and offers."
    return score, reason


def compute_match_scores(profile: ParentProfile, limit: int = 20) -> list[MatchScore]:
    """Compute and cache match scores for a profile against other profiles in the same chapter."""
    candidates = (
        ParentProfile.objects.filter(chapter=profile.chapter, is_onboarded=True)
        .exclude(id=profile.id)
        .select_related("user")[:50]
    )

    scores = []
    for candidate in candidates:
        prox = proximity_score(profile.zip_code, candidate.zip_code)
        age = age_overlap_score(profile.kids_ages, candidate.kids_ages)
        sched = schedule_score(profile.availability, candidate.availability)
        ai_score, ai_reason = ai_needs_offers_score(profile, candidate)

        total = (
            WEIGHTS["proximity"] * prox
            + WEIGHTS["age_overlap"] * age
            + WEIGHTS["schedule"] * sched
            + WEIGHTS["needs_offers"] * ai_score
        )

        match, _ = MatchScore.objects.update_or_create(
            from_profile=profile,
            to_profile=candidate,
            defaults={
                "proximity_score": prox,
                "age_overlap_score": age,
                "schedule_score": sched,
                "needs_offers_score": ai_score,
                "total_score": total,
                "ai_reason": ai_reason,
            },
        )
        scores.append(match)

    scores.sort(key=lambda s: s.total_score, reverse=True)
    return scores[:limit]
