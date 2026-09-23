from __future__ import annotations


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.routes.auth import router as auth_router
from app.routes.categories import router as categories_router
from app.routes.counter import router as counter_router
from app.routes.menu import router as menu_router
from app.routes.orders import router as orders_router
from app.routes.payment import router as payment_router
from app.routes.restaurant import router as restaurant_router
from app.routes.sessions import router as sessions_router
from app.routes.super_admin import router as super_admin_router
from app.routes.tables import router as tables_router
from app.routes.websocket import router as websocket_router

app = FastAPI(
    title="Dinora API",
    description="Backend API for the Dinora dine-in ordering platform",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# Middleware — order matters: TrustedHost → CORS → routes
# ---------------------------------------------------------------------------

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS + ["testserver"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# ---------------------------------------------------------------------------
# Routers — registered once under /api prefix only
# (duplicate /api/v1 prefixes removed to eliminate route confusion)
# ---------------------------------------------------------------------------

def _mount(router, path: str) -> None:
    app.include_router(router, prefix=f"/api{path}")


_mount(restaurant_router, "/restaurant")
_mount(tables_router, "/tables")
_mount(menu_router, "/menu")
_mount(sessions_router, "/sessions")
_mount(orders_router, "/orders")
_mount(payment_router, "/orders")  # adds /api/orders/{id}/pay/init, /pay/verify, /admin-pay — see routes/payment.py
_mount(categories_router, "/categories")
_mount(counter_router, "/counter")
_mount(auth_router, "/auth")
_mount(super_admin_router, "/super-admin")
app.include_router(websocket_router)  # WebSocket paths have no /api prefix
# Payment: previously /api/payment/checkout was unauthenticated, unused,
# and could mark any order_id as paid with no amount verification — it was
# removed outright during the security audit, then rebuilt properly as a
# real Razorpay integration (see routes/payment.py and
# services/payment_gateway.py): auth-scoped, server-computed amount,
# idempotent, and the order is only ever marked paid after Razorpay's own
# HMAC signature is verified server-side. Requires RAZORPAY_KEY_ID and
# RAZORPAY_KEY_SECRET in .env — see the README's "Payments" section.


# ---------------------------------------------------------------------------
# Lifecycle — NO database create_all(), NO startup seeding
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def _startup() -> None:
    # Order status is staff-driven only — see routes/orders.py PATCH
    # /api/orders/{id} and order_service.update_order_status. There is no
    # background task advancing orders on a timer any more: a "ready" order
    # means kitchen staff marked it ready, not that some seconds elapsed.
    pass


@app.on_event("shutdown")
async def _shutdown() -> None:
    pass


# ---------------------------------------------------------------------------
# Global exception handlers — always return JSON with correct CORS headers
# ---------------------------------------------------------------------------

@app.exception_handler(404)
async def _not_found(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


@app.exception_handler(500)
async def _server_error(request: Request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.exception_handler(Exception)
async def _unhandled(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


# ---------------------------------------------------------------------------
# Health / manifest
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"name": "Dinora API", "status": "running"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "dinora-api"}


@app.get("/api/routes")
def route_manifest():
    return {
        "auth": ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"],
        "guest_flow": [
            "GET  /api/tables/{table_token}           → confirm table",
            "POST /api/tables/{table_token}/sessions  → create/resume session",
            "GET  /api/menu                            → browse menu",
            "POST /api/orders                          → place order (session_id only)",
            "GET  /api/orders/session/{session_id}    → initial order list",
            "POST /api/orders/{id}/pay/init            → start a Razorpay payment (session_id only)",
            "POST /api/orders/{id}/pay/verify           → confirm payment (Razorpay signature, verified server-side)",
            "GET  /api/orders/{id}/pay?session_id=     → check payment status for your own order",
            "WS   /ws/table?session_id=...            → live order updates",
        ],
        "admin": [
            "GET  /api/tables            → list tables for MY restaurant (auth)",
            "POST /api/tables            → create table for MY restaurant (auth)",
            "GET  /api/tables/{token}/qr → QR image, MY restaurant's table only (auth)",
            "GET  /api/orders            → orders for MY restaurant only (auth)",
            "PATCH /api/orders/{id}      → status override, MY restaurant only (auth)",
            "POST /api/orders/{id}/admin-pay → record payment taken at counter, MY restaurant only (auth)",
            "GET  /api/counter           → order-status totals for MY restaurant (auth)",
            "WS   /ws/counter?token=...  → order events for MY restaurant only (auth)",
            "GET  /api/restaurant/profile             → MY restaurant's business profile — crew size, type, seating (auth)",
            "PUT  /api/restaurant/profile             → set MY restaurant's business profile (auth)",
            "GET  /api/restaurant/payment-settings    → whether MY restaurant has its own Razorpay configured (auth)",
            "PUT  /api/restaurant/payment-settings    → set MY restaurant's own Razorpay credentials (auth)",
            "DELETE /api/restaurant/payment-settings  → clear MY restaurant's own credentials, revert to platform fallback (auth)",
        ],
        "super_admin": [
            "POST  /api/super-admin/login                       → Dinora platform operator login (NOT for restaurant owners)",
            "GET   /api/super-admin/me                           → current super admin",
            "GET   /api/super-admin/restaurants                  → every tenant restaurant, with owner + crew size + status",
            "GET   /api/super-admin/restaurants/{id}             → one restaurant's full detail",
            "PATCH /api/super-admin/restaurants/{id}             → suspend/reinstate a restaurant (body: {is_active})",
        ],
        "system": ["GET /api/health", "GET /docs"],
    }
