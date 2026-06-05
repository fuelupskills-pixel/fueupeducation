import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
from datetime import datetime, timedelta

# Add apps/backend to sys.path so we can import app models
sys.path.append(os.path.abspath("apps/backend"))

from app import models, database

load_dotenv(dotenv_path="apps/backend/.env")

# Initialize DB session
db = database.SessionLocal()

try:
    email = "test_verify@example.com"
    otp_code = "123456"
    now = datetime.utcnow()
    expires_at = now + timedelta(minutes=5)
    
    print("Inserting test OTP:")
    print("email:", email)
    print("otp:", otp_code)
    print("expires_at:", expires_at)
    
    otp_record = models.OTPVerification(
        email=email,
        otp=otp_code,
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()
    
    # Query it back
    print("\nQuerying immediately...")
    query_now = datetime.utcnow()
    record = db.query(models.OTPVerification).filter(
        models.OTPVerification.email == email,
        models.OTPVerification.otp == otp_code,
        models.OTPVerification.expires_at > query_now
    ).order_by(models.OTPVerification.id.desc()).first()
    
    print("Found record:", record)
    if record:
        print("Record details - ID:", record.id, "expires_at:", record.expires_at)
        
    # Clean up
    db.query(models.OTPVerification).filter(models.OTPVerification.email == email).delete()
    db.commit()
    print("Cleaned up.")
except Exception as e:
    print("Error:", e)
finally:
    db.close()
