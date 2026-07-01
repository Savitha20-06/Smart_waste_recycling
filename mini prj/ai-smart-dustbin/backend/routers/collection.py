from fastapi import APIRouter, HTTPException
from services.mock_db import bins_db, get_current_utc

router = APIRouter(tags=["collection"])

@router.post("/collect/{bin_id}")
def collect_bin(bin_id: str):
    if bin_id not in bins_db:
        raise HTTPException(status_code=404, detail="Bin not found")
    
    bin_obj = bins_db[bin_id]
    bin_obj.fill_level = 0
    bin_obj.status = "normal"
    bin_obj.last_updated = get_current_utc()
    
    return {"detail": f"Bin {bin_id} collected successfully.", "bin": bin_obj}
