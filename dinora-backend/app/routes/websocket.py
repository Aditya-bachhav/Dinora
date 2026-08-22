from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import manager
router = APIRouter(tags=["websocket"])

@router.websocket("/ws/counter")
async def counter_websocket(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)

@router.websocket("/ws/table")
async def table_websocket(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)
