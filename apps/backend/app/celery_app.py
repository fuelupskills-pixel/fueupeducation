import os
from celery import Celery

# Read broker URL from environment configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "fuelup_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks", "app.library_tasks"]
)

# Standard serialization and UTC time guidelines
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
