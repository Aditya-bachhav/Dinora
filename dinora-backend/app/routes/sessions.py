from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.session import DiningSession
from app.models.table import Table
from app.models.restaurant import Restaurant

router = APIRouter(tags=["sessions"])


def _get_active_session(session_id: str, db: Session) -> DiningSession:
    session = db.query(DiningSession).filter(DiningSession.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)) -> dict:
    """
    Verify a session is still active. Used by the frontend on page load
    to confirm a stored session_id is still valid before navigating to menu.
    Pure read — never mutates state.
    """
    session = _get_active_session(session_id, db)
    table = db.query(Table).filter(Table.id == session.table_id).first()
    restaurant = (
        db.query(Restaurant).filter(Restaurant.id == table.restaurant_id).first()
        if table else None
    )
    return {
        "session_id": session.id,
        "status": session.status,
        # Return table_token so client can reconstruct the /t/:token route if needed
        "table_token": table.token if table else None,
        "table_number": table.number if table else None,
        "restaurant_name": restaurant.name if restaurant else None,
    }


@router.post("/{session_id}/close")
def close_session(session_id: str, db: Session = Depends(get_db)) -> dict:
    """Close an active session (e.g. after payment)."""
    session = _get_active_session(session_id, db)
    session.status = "closed"
    db.commit()
    return {"session_id": session.id, "status": session.status}
