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
  tests/           # 64 pytest tests (89% coverage)

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
# Backend (from backend/)
venv/bin/python -m pytest tests/ -v --cov=.

# Frontend (from frontend/)
npx vitest run
```

## Deploy

**Backend (Railway)**: Connect GitHub repo, set root directory to `backend/`, add env vars.

**Frontend (Vercel)**: Connect GitHub repo, set root directory to `frontend/`, add `BACKEND_URL` env var pointing to Railway URL.

## License

MIT
