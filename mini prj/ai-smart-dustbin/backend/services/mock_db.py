import uuid
import random
from datetime import datetime, timezone
from typing import List, Dict
from models.bin import Bin, Alert

# In-memory storage
bins_db: Dict[str, Bin] = {}
alerts_db: List[Alert] = []

def get_current_utc():
    return datetime.now(timezone.utc)

def initialize_db():
    global bins_db, alerts_db
    bins_db.clear()
    alerts_db.clear()
    
    areas = ["Gandhipuram", "RS Puram", "Peelamedu", "Saibaba Colony", "Singanallur"]
    
    # Generate 25 mock bins
    for _ in range(25):
        bin_id = f"BIN-{random.randint(1000, 9999)}"
        area = random.choice(areas)
        # Random coordinates around Coimbatore, Tamil Nadu
        base_lat, base_lng = 11.0168, 76.9558
        lat = base_lat + random.uniform(-0.05, 0.05)
        lng = base_lng + random.uniform(-0.05, 0.05)
        
        fill_level = random.randint(0, 95)
        status = "critical" if fill_level > 80 else "normal"
        
        b = Bin(
            bin_id=bin_id,
            area=area,
            latitude=lat,
            longitude=lng,
            fill_level=fill_level,
            status=status,
            last_updated=get_current_utc()
        )
        bins_db[bin_id] = b

initialize_db()
