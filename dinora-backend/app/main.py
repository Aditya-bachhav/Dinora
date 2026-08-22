from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import asyncio
from app.services.order_automation import order_automation_loop

from app.core.config import settings
from app.core.database import init_db
from app.routes.counter import router as counter_router
from app.routes.auth import router as auth_router
from app.routes.categories import router as categories_router
from app.routes.menu import router as menu_router
from app.routes.orders import router as orders_router
from app.routes.payment import router as payment_router
from app.routes.restaurant import router as restaurant_router
from app.routes.sessions import router as sessions_router
from app.routes.tables import router as tables_router
from app.routes.websocket import router as websocket_router

app = FastAPI(
    title="Dinora API",
    description="Backend API for the Dinora dine-in ordering platform",
    version="0.1.0",
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS + ["testserver"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

def include_api_router(router, path: str) -> None:
    app.include_router(router, prefix=path)
    app.include_router(router, prefix=f"/api{path}")
    app.include_router(router, prefix=f"/api/v1{path}")


include_api_router(restaurant_router, "/restaurant")
include_api_router(tables_router, "/tables")
include_api_router(menu_router, "/menu")
include_api_router(sessions_router, "/sessions")
include_api_router(orders_router, "/orders")
include_api_router(payment_router, "/payment")
include_api_router(categories_router, "/categories")
include_api_router(counter_router, "/counter")
include_api_router(auth_router, "/auth")
app.include_router(websocket_router)

init_db()


@app.on_event("startup")
def startup_event() -> None:
    init_db()
    asyncio.create_task(order_automation_loop())


@app.get("/")
def root() -> dict[str, str]:
    return {"name": "Dinora API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/health")
@app.get("/api/v1/health")
def api_health_check():
    return {"status": "healthy", "service": "dinora-api"}

@app.get("/api/routes")
@app.get("/api/v1/routes")
def route_manifest():
    return {
        "auth": ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"],
        "guest": ["GET /api/tables/{table_token}", "GET /api/menu", "POST /api/orders", "GET /api/orders/{order_id}"],
        "admin": ["GET /api/orders", "POST /api/menu/items", "POST /api/categories", "POST /api/tables"],
        "system": ["GET /api/health", "GET /docs"]
    }


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Page not found"})
