from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BinBase(BaseModel):
    area: str
    latitude: float
    longitude: float

class BinCreate(BinBase):
    pass

class BinUpdate(BaseModel):
    area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    fill_level: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[str] = None

class Bin(BinBase):
    bin_id: str
    fill_level: int = Field(default=0, ge=0, le=100)
    status: str = "normal"
    last_updated: datetime

class Alert(BaseModel):
    alert_id: str
    bin_id: str
    message: str
    timestamp: datetime
    status: str = "unread"
