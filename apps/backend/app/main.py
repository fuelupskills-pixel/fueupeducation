import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, courses, students, creators, ai

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FuelUp Education API",
    description="Scalable production backend for modern FuelUp Education platform supporting multi-agent AI delivery, creator onboarding, and analytics.",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000", # Next.js frontend
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(creators.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "FuelUp Education Engine",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
