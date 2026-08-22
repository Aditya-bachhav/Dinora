from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.session import DiningSession

router = APIRouter(tags=["sessions"])


@router.get("/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)) -> dict[str, object]:
    session = db.query(DiningSession).filter(DiningSession.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"id": session.id, "table_id": session.table_id, "status": session.status}


@router.post("/{session_id}/close")
def close_session(session_id: str, db: Session = Depends(get_db)) -> dict[str, object]:
    session = db.query(DiningSession).filter(DiningSession.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    session.status = "closed"
    db.commit()
    return {"id": session.id, "table_id": session.table_id, "status": session.status}
