import asyncio
import random
import uuid
from services.mock_db import bins_db, alerts_db, get_current_utc
from models.bin import Alert

async def start_simulation():
    # Run every 5 seconds
    while True:
        await asyncio.sleep(5)
        
        current_time = get_current_utc()
        
        for bin_id, b in bins_db.items():
            # Increase fill level by 1 to 5%
            b.fill_level = min(100, b.fill_level + random.randint(1, 4))
            
            # Occasionally 'collect' (reset) bin
            if random.random() < 0.05: # 5% chance
                b.fill_level = 0
            
            # Update status
            prev_status = b.status
            b.status = "critical" if b.fill_level > 80 else "normal"
            b.last_updated = current_time
            
            # Generate alert on becoming critical
            if prev_status == "normal" and b.status == "critical":
                new_alert = Alert(
                    alert_id=str(uuid.uuid4()),
                    bin_id=b.bin_id,
                    message=f"Bin {b.bin_id} in {b.area} has reached critical fill level ({b.fill_level}%).",
                    timestamp=current_time,
                    status="unread"
                )
                alerts_db.append(new_alert)
                
                # Keep alerts list bounded
                if len(alerts_db) > 100:
                    alerts_db.pop(0)
