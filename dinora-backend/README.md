# Dinora Backend

FastAPI service for Dinora's QR dine-in workflow.

## Responsibilities

- Admin authentication
- Restaurant, category, menu and table management
- Table session lookup and QR generation
- Cart order creation and order lookup
- Kitchen/counter read model
- Automatic order status progression
- WebSocket support for real-time updates

## Structure

```text
app/
├── core/          # settings + databaseV
├── models/        # SQLAlchemy models
├── schemas/       # request/response schemas
├── routes/        # HTTP/WebSocket endpoints
├── services/      # business workflows
├── websocket/     # connection manager
└── main.py        # application entrypoint
data/              # local SQLite only; ignored by Git
```

There are no server-rendered HTML templates. The React application is the only UI.

## Local setup

```bash
python -m pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check: `GET http://localhost:8000/api/health`\n\nSwagger: `http://localhost:8000/docs`

## Environment

Never commit `.env` or a database file. Use a long random `SECRET_KEY` in every deployed environment and set `CORS_ORIGINS` to the actual frontend origin.

## Production database

SQLite is for local development. For production use PostgreSQL or another managed relational database by setting `DATABASE_URL`.

## Authentication

Admin passwords are hashed with PBKDF2-HMAC-SHA256. Admin access tokens are signed JWTs with a finite lifetime, so authentication does not depend on process-local memory and can scale across multiple API workers.
