import asyncio
from app.core.database import SessionLocal
from app.routes.orders import _advance_orders

async def order_automation_loop():
    while True:
        try:
            if SessionLocal:
                db = SessionLocal()
                try:
                    _advance_orders(db)
                finally:
                    db.close()
        except Exception:
            pass
        await asyncio.sleep(2)
