import logging
import time

logger = logging.getLogger("village.requests")


class RequestLoggingMiddleware:
    """Log every request with method, path, status, and duration."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000

        logger.info(
            "%s %s %s %.0fms",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )

        return response
