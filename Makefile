.PHONY: dev backend-setup backend-run frontend-setup frontend-dev lint test docker-up

dev:
	@echo "Starting backend and frontend..."
	@make backend-run & make frontend-dev & wait

backend-setup:
	cd backend && python3 -m venv venv
	cd backend && venv/bin/pip install -e ".[dev]"
	cd backend && venv/bin/python manage.py migrate

backend-run:
	cd backend && venv/bin/python manage.py runserver 0.0.0.0:8000

frontend-setup:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

lint:
	cd backend && venv/bin/ruff check .
	cd frontend && npm run lint

test:
	cd backend && venv/bin/pytest
	cd frontend && npm run test

docker-up:
	docker-compose up --build
