import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set environment variable to test database
os.environ["DATABASE_URL"] = "sqlite:///./test_fuelup.db"

from app.database import Base, engine
from app.main import app

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_otp_flow():
    email = "otp-tester@fuelupeducation.com"
    
    # 1. Send OTP
    send_response = client.post(
        "/api/auth/otp/send",
        json={"email": email}
    )
    assert send_response.status_code == 200
    assert send_response.json()["status"] == "success"
    
    # Since we cannot easily intercept print, let's query the DB directly to get the code or simulate code verification
    from app.database import SessionLocal
    from app.models import OTPVerification
    
    db = SessionLocal()
    record = db.query(OTPVerification).filter(OTPVerification.email == email).order_by(OTPVerification.id.desc()).first()
    assert record is not None
    otp_code = record.otp
    db.close()
    
    # 2. Verify with wrong OTP
    verify_bad = client.post(
        "/api/auth/otp/verify",
        json={
            "email": email,
            "otp": "000000",
            "name": "OTP User",
            "role": "student"
        }
    )
    assert verify_bad.status_code == 400
    
    # 3. Verify with correct OTP (registers new user on the fly)
    verify_good = client.post(
        "/api/auth/otp/verify",
        json={
            "email": email,
            "otp": otp_code,
            "name": "OTP User",
            "role": "student"
        }
    )
    assert verify_good.status_code == 200
    token = verify_good.json()["access_token"]
    assert token is not None
    
    # 4. Get Me
    me_response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == email
    assert me_response.json()["name"] == "OTP User"
    assert me_response.json()["role"] == "student"
