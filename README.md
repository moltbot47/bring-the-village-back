# Bring the Village Back

Community platform for single parents to match, share mutual support, and build local "village" networks.

## Stack

- **Backend**: Django 5+ / Django REST Framework / SQLite (dev) / PostgreSQL (prod)
- **Frontend**: React 18 / TypeScript / Vite
- **AI**: Anthropic Claude Haiku — matching engine + feedback triage
- **Payments**: Zeffy (0% platform fee donations)
- **Deploy**: Vercel (frontend) + Railway (backend)

## Quick Start

```bash
# Clone
git clone https://github.com/moltbot47/bring-the-village-back.git
cd bring-the-village-back

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers gunicorn anthropic dj-database-url psycopg2-binary
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

Copy `.env.example` and fill in values:

| Variable | Required | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | prod only | Random secret key |
| `DATABASE_URL` | prod only | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | optional | Enables AI matching + feedback triage |
| `SENTRY_DSN` | optional | Error tracking (sentry.io) |
| `VITE_SENTRY_DSN` | optional | Frontend error tracking |
| `VITE_ZEFFY_*` | optional | Zeffy donation form URLs |

## Architecture

```
backend/
  village/         # Django project settings
  core/            # Health endpoint, middleware
  accounts/        # Auth + parent profiles
  waitlist/        # Pre-launch waitlist
  donations/       # Donation tracking
  matching/        # AI-powered parent matching
  timebank/        # Time exchange system
  messaging/       # Polling-based messaging
  community/       # Events + RSVPs
  feedback/        # AI-triaged feedback system
  tests/           # 67 pytest tests (89% coverage)

frontend/
  src/
    api/           # Typed Axios client
    components/    # Button3D, Card, Layout, ErrorBoundary, etc.
    context/       # AuthContext
    pages/         # Landing, Dashboard, Matches, Messages, etc.
    test/          # 15 vitest tests
```

## Testing

```bash
# Backend unit/integration (67 tests, 89% coverage)
cd backend && venv/bin/python -m pytest tests/ -v --cov=.

# Frontend unit (15 tests)
cd frontend && npx vitest run

# E2E smoke tests (7 tests, requires dev server)
cd frontend && npx playwright test

# Load testing (requires locust)
cd backend && locust -f tests/locustfile.py --host http://localhost:8000
```

## Monitoring

- **Health check**: `GET /api/health/` (liveness)
- **Readiness probe**: `GET /api/health/detail/` (DB connectivity, version)
- **Status page**: `/status` in the frontend app
- **API docs**: `GET /api/docs/` (Swagger UI) / `GET /api/schema/` (OpenAPI JSON)
- **Error tracking**: Sentry (set `SENTRY_DSN` env var)
- **Request logging**: All requests logged with method, path, status, duration

### Uptime Monitoring Setup

Point any uptime monitoring service (UptimeRobot, Better Stack, Checkly) at:
- `https://your-backend.up.railway.app/api/health/detail/`
- Alert if response is not 200 or `status` is not `"ok"`

## Deploy

**Backend (Railway)**: Connect GitHub repo, set root directory to `backend/`, add env vars.

**Frontend (Vercel)**: Connect GitHub repo, set root directory to `frontend/`, add `BACKEND_URL` env var pointing to Railway URL.

## License

MIT
