"""
Password hashing, shared by routes/auth.py and scripts/seed.py.

Pulled out of routes/auth.py so that seeding a demo admin doesn't require
importing a route module's private (underscore-prefixed) helper — the same
"reach into another module's internals" pattern that services/order_service.py
was extracted to avoid for order logic.
"""
from __future__ import annotations

import hashlib
import hmac
import secrets

PBKDF2_ITERATIONS = 310_000


def hash_password(password: str, *, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
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
