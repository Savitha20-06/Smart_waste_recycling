from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import bins, collection, routes, alerts, analytics, ai
from simulation.engine import start_simulation

app = FastAPI(title="Smart Waste AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bins.router, prefix="/api")
app.include_router(collection.router, prefix="/api")
app.include_router(routes.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    import asyncio
    asyncio.create_task(start_simulation())

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Waste AI Backend"}
