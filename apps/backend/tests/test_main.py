import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test database (SQLite file-based to share connection)
import os
if os.path.exists("./test_fuelup.db"):
    try:
        os.remove("./test_fuelup.db")
    except Exception:
        pass

os.environ["DATABASE_URL"] = "sqlite:///./test_fuelup.db"

from app.database import Base, get_db
from app.main import app

# Create tables in memory
from app.database import engine
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == "FuelUp Education Engine"

def test_user_flow():
    # Register Student
    reg_response = client.post(
        "/api/auth/register",
        json={
            "email": "student@fuelupeducation.com",
            "name": "Student Test",
            "password": "strongpassword123",
            "role": "student"
        }
    )
    assert reg_response.status_code == 201
    assert reg_response.json()["email"] == "student@fuelupeducation.com"

    # Attempt Register Duplicate
    dup_response = client.post(
        "/api/auth/register",
        json={
            "email": "student@fuelupeducation.com",
            "name": "Student Test",
            "password": "strongpassword123",
            "role": "student"
        }
    )
    assert dup_response.status_code == 400

    # Login
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "student@fuelupeducation.com",
            "password": "strongpassword123"
        }
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    assert token is not None

    # Get Me
    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["role"] == "student"
