from fastapi import APIRouter
from typing import Dict, Any
from services.mock_db import bins_db
import math
import uuid

router = APIRouter(tags=["routes"])

def euclidean_distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)

@router.post("/routes/optimize")
def optimize_route() -> Dict[str, Any]:
    critical_bins = [b for b in bins_db.values() if b.fill_level > 80]
    
    if not critical_bins:
        return {"route_id": str(uuid.uuid4()), "bins": [], "total_distance": 0, "estimated_time_mins": 0}
    
    # Simple nearest-neighbor from the first critical bin
    unvisited = critical_bins.copy()
    current = unvisited.pop(0)
    route = [current]
    total_distance = 0.0
    
    while unvisited:
        # Find nearest neighbor
        nearest = min(unvisited, key=lambda b: euclidean_distance(current.latitude, current.longitude, b.latitude, b.longitude))
        total_distance += euclidean_distance(current.latitude, current.longitude, nearest.latitude, nearest.longitude)
        current = nearest
        unvisited.remove(nearest)
        route.append(current)
        
    # Mock conversion from arbitrary distance unit to km (just multiplying for realistic numbers), and time
    dist_km = total_distance * 111  # Rough approximation of degrees to km
    estimated_time = int(dist_km * 4) + len(route) * 5 # 15km/h speed + 5 min per bin
    
    return {
        "route_id": str(uuid.uuid4()),
        "bins": route,
        "total_distance_km": round(dist_km, 2),
        "estimated_time_mins": estimated_time
    }
