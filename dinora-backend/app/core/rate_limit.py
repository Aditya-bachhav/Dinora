"""
Lightweight in-memory rate limiter.

Found during audit: POST /api/auth/login had no throttling at all — an
attacker could fire unlimited password guesses with zero friction (PBKDF2
slows each individual guess down computationally, but nothing stopped
firing guesses in parallel or in a tight loop). This closes that gap.

Deliberately dependency-free (no Redis) to match the project's existing
in-process WebSocket connection manager (app/websocket/manager.py), which
has the same documented tradeoff: correct and sufficient for a single
server process, and would need a shared store if this app ever runs as
multiple horizontally-scaled instances behind a load balancer.
"""
from __future__ import annotations

import time
from collections import defaultdict, deque


class SlidingWindowRateLimiter:
    def __init__(self, *, max_attempts: int, window_seconds: float) -> None:
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> tuple[bool, float]:
        """
        Returns (allowed, retry_after_seconds). Does NOT record an attempt —
        call record() separately so failed-vs-succeeded callers can decide
        whether an attempt should count (see login(), which only records
        failures, so a correct password on the first try is never penalized
        by earlier unrelated failures from someone else sharing the key).
        """
        now = time.monotonic()
        hits = self._hits[key]
        while hits and now - hits[0] > self.window_seconds:
            hits.popleft()
        if len(hits) >= self.max_attempts:
            retry_after = self.window_seconds - (now - hits[0])
            return False, max(0.0, retry_after)
        return True, 0.0

    def record(self, key: str) -> None:
        self._hits[key].append(time.monotonic())

    def reset(self, key: str) -> None:
        self._hits.pop(key, None)
