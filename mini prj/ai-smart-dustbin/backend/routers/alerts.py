from fastapi import APIRouter
from typing import List
from models.bin import Alert
from services.mock_db import alerts_db

router = APIRouter(tags=["alerts"])

@router.get("/alerts", response_model=List[Alert])
def get_alerts():
    # Sort by timestamp descending
    return sorted(alerts_db, key=lambda a: a.timestamp, reverse=True)
