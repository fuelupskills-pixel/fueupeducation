import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from datetime import datetime

# Load environment configurations
load_dotenv(dotenv_path="apps/backend/.env")
DATABASE_URL = os.getenv("DATABASE_URL")
print("Connecting to:", DATABASE_URL)

engine = create_engine(DATABASE_URL)
with engine.connect() as conn:
    print("\n--- Current UTC Time ---")
    print(datetime.utcnow())
    
    print("\n--- Columns in otp_verifications ---")
    res = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'otp_verifications'"))
    for row in res:
        print(row)
        
    print("\n--- Records in otp_verifications ---")
    res = conn.execute(text("SELECT id, email, otp, expires_at, created_at FROM otp_verifications ORDER BY id DESC LIMIT 5"))
    for row in res:
        print(row)
