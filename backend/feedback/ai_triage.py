"""
AI-powered feedback triage.

Automatically categorizes and prioritizes incoming feedback using Claude.
Runs on every new submission — keeps the feedback queue lean and actionable.
"""

import json
import logging
import os

logger = logging.getLogger(__name__)


def triage_feedback(text: str) -> dict:
    """
    Use Claude to categorize, summarize, and prioritize feedback.
    Returns: {"category": str, "summary": str, "priority": int}
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")

    if not api_key:
        return _keyword_triage(text)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=150,
            messages=[{
                "role": "user",
                "content": f"""Categorize this user feedback for a community platform for single parents.

Feedback: "{text}"

Respond with ONLY a JSON object:
{{
  "category": one of "bug", "feature", "safety", "ux", "praise", "other",
  "summary": "one sentence summary under 100 chars",
  "priority": 1-5 where 5=urgent safety issue, 4=blocking bug, 3=important feature, 2=nice to have, 1=low
}}""",
            }],
        )

        result = json.loads(response.content[0].text.strip())
        return {
            "category": result.get("category", "other"),
            "summary": result.get("summary", "")[:200],
            "priority": min(5, max(1, int(result.get("priority", 2)))),
        }

    except Exception as e:
        logger.warning("AI triage failed, using keyword fallback: %s", e)
        return _keyword_triage(text)


def _keyword_triage(text: str) -> dict:
    """Simple keyword-based categorization fallback."""
    lower = text.lower()

    if any(w in lower for w in ["unsafe", "danger", "creep", "threat", "abuse"]):
        return {"category": "safety", "summary": text[:100], "priority": 5}
    if any(w in lower for w in ["bug", "error", "broken", "crash", "not working"]):
        return {"category": "bug", "summary": text[:100], "priority": 4}
    if any(w in lower for w in ["love", "great", "amazing", "thank"]):
        return {"category": "praise", "summary": text[:100], "priority": 1}
    if any(w in lower for w in ["wish", "would be nice", "feature", "add", "suggest"]):
        return {"category": "feature", "summary": text[:100], "priority": 2}
    if any(w in lower for w in ["confusing", "hard to", "design", "ui", "ugly"]):
        return {"category": "ux", "summary": text[:100], "priority": 2}

    return {"category": "other", "summary": text[:100], "priority": 2}
