from fastapi import APIRouter, HTTPException
from typing import List, Dict
from models.bin import Bin, BinCreate, BinUpdate
from services.mock_db import bins_db, get_current_utc
import uuid
import random

router = APIRouter(tags=["bins"])

@router.get("/bins", response_model=List[Bin])
def get_all_bins():
    return list(bins_db.values())

@router.get("/bins/critical", response_model=List[Bin])
def get_critical_bins():
    return [b for b in bins_db.values() if b.fill_level > 80]

@router.post("/bins", response_model=Bin)
def create_bin(bin_in: BinCreate):
    bin_id = f"BIN-{random.randint(1000, 9999)}"
    new_bin = Bin(
        bin_id=bin_id,
        area=bin_in.area,
        latitude=bin_in.latitude,
        longitude=bin_in.longitude,
        fill_level=0,
        status="normal",
        last_updated=get_current_utc()
    )
    bins_db[bin_id] = new_bin
    return new_bin

@router.put("/bins/{bin_id}", response_model=Bin)
def update_bin(bin_id: str, bin_update: BinUpdate):
    if bin_id not in bins_db:
        raise HTTPException(status_code=404, detail="Bin not found")
    
    existing_bin = bins_db[bin_id]
    update_data = bin_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(existing_bin, key, value)
    
    # Auto-update status if fill_level changes
    if "fill_level" in update_data:
        existing_bin.status = "critical" if existing_bin.fill_level > 80 else "normal"
    
    existing_bin.last_updated = get_current_utc()
    return existing_bin

@router.delete("/bins/{bin_id}")
def delete_bin(bin_id: str):
    if bin_id not in bins_db:
        raise HTTPException(status_code=404, detail="Bin not found")
    del bins_db[bin_id]
    return {"detail": "Bin deleted successfully"}
