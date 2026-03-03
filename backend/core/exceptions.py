import logging

from rest_framework.views import exception_handler

logger = logging.getLogger("village.errors")


def custom_exception_handler(exc, context):
    """Standardize all API error responses to a consistent JSON shape."""
    response = exception_handler(exc, context)

    if response is not None:
        # Log server errors
        if response.status_code >= 500:
            logger.error(
                "Server error: %s %s → %s",
                context["request"].method,
                context["request"].path,
                exc,
            )

        # Standardize error shape
        data = response.data
        if isinstance(data, dict) and "detail" in data:
            # Already has detail key — keep as-is
            pass
        elif isinstance(data, dict):
            # Field-level validation errors → wrap them
            response.data = {
                "detail": "Validation error.",
                "errors": data,
            }
        elif isinstance(data, list):
            response.data = {
                "detail": data[0] if data else "An error occurred.",
            }

    return response
