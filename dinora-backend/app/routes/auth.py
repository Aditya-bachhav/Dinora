from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.admin import AdminUser

router = APIRouter(tags=["auth"])

TOKEN_ALGORITHM = "HS256"
TOKEN_TTL_HOURS = 12
PBKDF2_ITERATIONS = 310_000


def _password_hash(password: str, *, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def _verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt_hex, digest_hex = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations),
        ).hex()
        return hmac.compare_digest(candidate, digest_hex)
    except (ValueError, TypeError):
        return False


def _issue_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS)
    return jwt.encode(
        {"sub": str(user_id), "exp": expires_at},
        settings.SECRET_KEY,
        algorithm=TOKEN_ALGORITHM,
    )


def current_admin(request: Request, db: Session = Depends(get_db)) -> AdminUser:
    auth_header = request.headers.get("Authorization", "")
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Admin login required")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[TOKEN_ALGORITHM])
        user_id = int(payload.get("sub"))
    except (jwt.PyJWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired admin session") from None

    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Admin account not found")
    return user


@router.post("/register")
async def register(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    name = str(payload.get("name") or "").strip()
    email = str(payload.get("email") or "").strip().lower()
    password = str(payload.get("password") or "")

    if not name or not email or len(password) < 8:
        raise HTTPException(status_code=400, detail="Name, email and a password of at least 8 characters are required")

    if db.query(AdminUser).filter(AdminUser.email == email).first():
        raise HTTPException(status_code=409, detail="An admin account with this email already exists")

    user = AdminUser(name=name, email=email, password_hash=_password_hash(password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "token": _issue_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@router.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    email = str(payload.get("email") or "").strip().lower()
    password = str(payload.get("password") or "")
    user = db.query(AdminUser).filter(AdminUser.email == email).first()

    if user is None or not _verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "token": _issue_token(user.id),
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@router.get("/me")
def me(user: AdminUser = Depends(current_admin)):
    return {"id": user.id, "name": user.name, "email": user.email}
