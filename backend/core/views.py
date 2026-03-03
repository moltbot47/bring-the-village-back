from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health(request):
    """Liveness check — always returns 200 if the app process is running."""
    return Response({"status": "ok"})


@api_view(["GET"])
def health_detail(request):
    """Readiness check — verifies database connectivity and returns app info."""
    checks = {"app": "ok", "database": "ok"}
    status_code = 200

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        checks["database"] = f"error: {e}"
        status_code = 503

    return Response(
        {
            "status": "ok" if status_code == 200 else "degraded",
            "version": "0.1.0",
            "checks": checks,
        },
        status=status_code,
    )
