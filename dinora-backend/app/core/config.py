from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


def load_env_file(path: Path | None = None) -> None:
    env_path = path or ENV_FILE
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()


class Settings:
    APP_NAME = os.getenv("APP_NAME", "Dinora Backend")
    DEBUG = os.getenv("DEBUG", "false").lower() in {"1", "true", "yes", "on"}
    DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
    SECRET_KEY = os.getenv("SECRET_KEY", "")
    ALLOWED_HOSTS = [
        host.strip()
        for host in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
        if host.strip()
    ]
    CORS_ORIGINS = [
        origin.strip().rstrip("/")
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]
    CORS_ORIGIN_REGEX = os.getenv(
        "CORS_ORIGIN_REGEX",
        r"https?://(?:localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3})(?::\d+)?$",
    )

    # Razorpay — the PLATFORM-level fallback credentials, used only when a
    # restaurant hasn't configured its own (see models/restaurant.py,
    # services/payment_gateway.py). The app boots fine without these set,
    # so a fresh checkout of this repo doesn't hard-fail before anyone's
    # configured a merchant account; POST /api/orders/{id}/pay/init returns
    # a clear 503 instead if no credentials are available at all.
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "").strip()
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "").strip()

    # Encrypts each restaurant's own Razorpay key secret at rest — see
    # core/encryption.py. Deliberately a separate key from SECRET_KEY (JWT
    # signing and data encryption should never share a key). Only required
    # once a restaurant configures its own payment credentials; the app
    # boots fine without it, same as the Razorpay vars above.
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "").strip()

    # Cloudinary credentials are server-side only. The API secret must never
    # be exposed through the frontend's VITE_* environment variables.
    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "").strip()
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "").strip()
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()


settings = Settings()

if not settings.DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is required. Configure a Supabase PostgreSQL URL in dinora-backend/.env. "
        "SQLite fallback has been intentionally removed from the application runtime."
    )

if not settings.SECRET_KEY:
    if settings.DEBUG:
        # Development-only fallback, and ONLY when DEBUG=true is explicitly
        # set. Previously this fallback applied unconditionally, so a
        # production deployment that forgot to set SECRET_KEY would boot
        # normally and silently sign every admin JWT with a publicly known
        # value instead of failing to start.
        settings.SECRET_KEY = "dev-only-change-me-please-replace-12345"
    else:
        raise RuntimeError(
            "SECRET_KEY is required. Configure a strong random SECRET_KEY in "
            "dinora-backend/.env. It is only allowed to be empty when DEBUG=true."
        )
