import os
import io
import pytest
from fastapi.testclient import TestClient

# Ensure database is configured
os.environ["DATABASE_URL"] = "sqlite:///./test_fuelup.db"

from app.database import Base, engine
from app.main import app

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_ai_flow():
    # 1. Register a student user
    email = "ai-student@fuelupeducation.com"
    reg_response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "name": "AI Student",
            "password": "strongpassword123",
            "role": "student"
        }
    )
    assert reg_response.status_code == 201

    # 2. Login
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": email,
            "password": "strongpassword123"
        }
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    assert token is not None

    # 3. Test AI Tutor Chat
    chat_response = client.post(
        "/api/ai/chat",
        json={
            "message": "why is the sky blue?",
            "lecture_title": "Atmospheric Science"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert chat_response.status_code == 200
    assert "reply" in chat_response.json()
    assert chat_response.json()["role"] == "AI Tutor"

    # 4. Test AI Doubt Solver OCR Integration
    # Create a dummy text file to act as the uploaded image/document
    dummy_file = io.BytesIO(b"math formula: integral x*sin(x) dx")
    doubt_response = client.post(
        "/api/ai/doubts/solve",
        data={
            "subject": "Mathematics",
            "preferred_lang": "en"
        },
        files={
            "file": ("math_doubt.png", dummy_file, "image/png")
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert doubt_response.status_code == 200
    data = doubt_response.json()
    assert "doubt_id" in data
    assert "ocr_extracted_text" in data
    assert "solution" in data
    assert "steps" in data["solution"]
    assert len(data["solution"]["steps"]) > 0
    assert "final_answer" in data["solution"]
    assert "suggested_practice_quiz" in data
