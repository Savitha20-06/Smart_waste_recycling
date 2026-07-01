from fastapi import APIRouter
from typing import Dict, Any, List
from services.mock_db import bins_db

router = APIRouter(tags=["analytics"])

@router.get("/analytics/summary")
def get_analytics_summary() -> Dict[str, Any]:
    total_bins = len(bins_db)
    critical_bins = sum(1 for b in bins_db.values() if b.fill_level > 80)
    avg_fill = sum(b.fill_level for b in bins_db.values()) / total_bins if total_bins > 0 else 0
    
    distribution_by_area = {}
    for b in bins_db.values():
        if b.area not in distribution_by_area:
            distribution_by_area[b.area] = {"total": 0, "critical": 0}
        distribution_by_area[b.area]["total"] += 1
        if b.fill_level > 80:
            distribution_by_area[b.area]["critical"] += 1
            
    import random
    from datetime import datetime
    
    co2_saved = round(total_bins * 14.5 + critical_bins * 2.1 + random.uniform(0.1, 0.9), 1)

    truck_areas = {
        "RS Puram": (11.0045, 76.9482),
        "Gandhipuram": (11.0168, 76.9616),
        "Peelamedu": (11.0289, 77.0019),
        "Saibaba Colony": (11.0250, 76.9450),
        "Singanallur": (11.0020, 77.0280),
        "Depot": (11.0100, 76.9700)
    }
    
    trucks = []
    for t_id in ["TRK-01", "TRK-02", "TRK-03"]:
        loc = random.choice(list(truck_areas.keys()))
        lat, lng = truck_areas[loc]
        trucks.append({
            "id": t_id,
            "status": random.choice(["Collecting", "En Route", "Idle"]),
            "location": loc,
            "progress": random.randint(5, 95),
            "latitude": lat + random.uniform(-0.015, 0.015),
            "longitude": lng + random.uniform(-0.015, 0.015)
        })
    
    weather = {
        "temp": round(31.0 + random.uniform(-0.8, 0.8), 1),
        "condition": random.choice(["Partly Cloudy", "Sunny", "Overcast", "Clear"]),
        "humidity": random.randint(60, 75),
        "forecast": "Light Rain Expected"
    }

    activity = []
    if critical_bins > 0:
        activity.append({"time": "Just now", "text": f"ALERT: {critical_bins} bins reached critical capacity!", "type": "warning"})
    else:
        activity.append({"time": "Just now", "text": "System running optimally. No critical bins.", "type": "success"})
        
    activity.append({"time": f"{random.randint(1, 15)} min ago", "text": f"Truck {random.choice(['TRK-01', 'TRK-02', 'TRK-03'])} routed to {random.choice(list(truck_areas.keys()))}", "type": "info"})
    activity.append({"time": f"{random.randint(20, 59)} min ago", "text": f"AI route optimization algorithm executed successfully.", "type": "success"})

    hotzones = []
    for area, stats in distribution_by_area.items():
        base_risk = (stats["critical"] / (stats["total"] or 1)) * 100
        hotzones.append({
            "subject": area,
            "A": min(100, int(base_risk + random.randint(10, 40))),
            "fullMark": 100
        })
            
    return {
        "total_bins": total_bins,
        "critical_bins": critical_bins,
        "avg_fill_level": round(avg_fill, 2),
        "distribution_by_area": distribution_by_area,
        "co2_saved_kg": co2_saved,
        "active_trucks": trucks,
        "weather": weather,
        "recent_activity": activity,
        "predictive_hotzones": hotzones
    }

@router.get("/analytics/trends")
def get_analytics_trends(days: int = 7) -> List[Dict[str, Any]]:
    import random
    from datetime import datetime, timedelta
    
    # Generate mock trend data for the requested number of days
    data = []
    base_date = datetime.now() - timedelta(days=days-1)
    
    # Base fill level to vary from
    current_val = 50.0
    
    for i in range(days):
        date = base_date + timedelta(days=i)
        # Random walk for more realistic looking simulation data
        current_val += random.uniform(-10, 12)
        current_val = max(20, min(95, current_val))
        
        day_label = date.strftime("%a") if days <= 7 else date.strftime("%d %b")
        
        data.append({
            "day": day_label,
            "avg_fill": round(current_val, 1)
        })
        
    return data
