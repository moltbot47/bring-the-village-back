FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir django djangorestframework django-cors-headers gunicorn anthropic

COPY . .

RUN python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8000

CMD ["gunicorn", "village.wsgi", "--bind", "0.0.0.0:8000", "--workers", "2"]
