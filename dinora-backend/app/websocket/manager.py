from __future__ import annotations

from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, ws: WebSocket, room: str) -> None:
        await ws.accept()
        self.rooms[room].add(ws)

    def disconnect(self, ws: WebSocket, room: str) -> None:
        connections = self.rooms.get(room)
        if not connections:
            return
        connections.discard(ws)
        if not connections:
            self.rooms.pop(room, None)

    async def broadcast(self, message: str, rooms: list[str]) -> None:
        dead: list[tuple[str, WebSocket]] = []
        seen: set[int] = set()
        for room in rooms:
            for ws in list(self.rooms.get(room, ())):
                if id(ws) in seen:
                    continue
                seen.add(id(ws))
                try:
                    await ws.send_text(message)
                except Exception:
                    dead.append((room, ws))
        for room, ws in dead:
            self.disconnect(ws, room)


manager = ConnectionManager()
