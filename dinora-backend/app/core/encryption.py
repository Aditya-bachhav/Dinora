"""
Symmetric encryption for secrets stored in the database — specifically,
each restaurant's own Razorpay key secret (see models/restaurant.py,
services/payment_gateway.py).

Why this exists and why it's a SEPARATE key from SECRET_KEY: SECRET_KEY
signs admin JWTs — a completely different purpose with a completely
different blast radius if it leaks (a leaked JWT signing key lets someone
forge admin sessions; a leaked encryption key lets someone decrypt every
restaurant's payment credentials). Reusing one key for both would mean a
single compromise unlocks both attack surfaces at once. They are
deliberately independent, generated independently, and rotated independently.

Uses Fernet (AES-128-CBC + HMAC, from the `cryptography` package) — an
authenticated encryption scheme, so tampering with an encrypted value is
detected (raises InvalidToken) rather than silently decrypting to garbage.
"""
from __future__ import annotations

from functools import lru_cache

from app.core.config import settings


class EncryptionNotConfigured(Exception):
    """Raised when ENCRYPTION_KEY is not set but an encrypt/decrypt was attempted."""


@lru_cache(maxsize=1)
def _fernet():
    if not settings.ENCRYPTION_KEY:
        raise EncryptionNotConfigured(
            "ENCRYPTION_KEY is not set in the environment. Per-restaurant payment "
            "credentials cannot be stored or read until it's configured — generate "
            "one with: python -c \"from cryptography.fernet import Fernet; "
            "print(Fernet.generate_key().decode())\""
        )
    from cryptography.fernet import Fernet

    return Fernet(settings.ENCRYPTION_KEY.encode("utf-8"))


def encrypt_secret(plaintext: str) -> str:
    """Encrypt a secret for storage. Returns a string safe to put in a
    String/Text database column."""
    token = _fernet().encrypt(plaintext.encode("utf-8"))
    return token.decode("utf-8")


def decrypt_secret(ciphertext: str) -> str:
    """Decrypt a value previously produced by encrypt_secret(). Raises
    cryptography.fernet.InvalidToken if the value was tampered with or
    encrypted under a different key (e.g. after a key rotation without a
    migration of existing values)."""
    plaintext = _fernet().decrypt(ciphertext.encode("utf-8"))
    return plaintext.decode("utf-8")
