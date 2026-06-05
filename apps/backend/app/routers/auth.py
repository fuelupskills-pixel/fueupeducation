from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import database, models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        name=user_in.name,
        password_hash=hashed_password,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If creator, initialize stats record
    if new_user.role == "creator":
        stats = models.CreatorStats(creator_id=new_user.id, monthly_views=0, revenue_earned=0.0)
        db.add(stats)
        db.commit()

    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role, "user_id": user.id}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

import random
from datetime import datetime, timedelta

@router.post("/otp/send")
def send_otp(request: schemas.OTPSend, db: Session = Depends(database.get_db)):
    # Generate 6-digit OTP code
    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    # Store in database
    otp_record = models.OTPVerification(
        email=request.email,
        otp=otp_code,
        expires_at=expires_at
    )
    db.add(otp_record)
    db.commit()
    
    # Print to console (to simulate email sending in dev environment)
    print(f"\n[EMAIL_SERVICE] Sending OTP {otp_code} to {request.email} (expires in 5 minutes)\n", flush=True)
    
    return {
        "status": "success",
        "message": f"One-Time Password sent successfully to {request.email}. (Dev mode: check terminal logs for OTP)"
    }

@router.post("/otp/verify", response_model=schemas.Token)
def verify_otp(request: schemas.OTPVerify, db: Session = Depends(database.get_db)):
    # Find the latest valid OTP for this email
    now = datetime.utcnow()
    otp_record = db.query(models.OTPVerification).filter(
        models.OTPVerification.email == request.email,
        models.OTPVerification.otp == request.otp,
        models.OTPVerification.expires_at > now
    ).order_by(models.OTPVerification.id.desc()).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP code"
        )
    
    # Delete the OTP verification records for this email after use
    db.query(models.OTPVerification).filter(models.OTPVerification.email == request.email).delete()
    db.commit()
    
    # Check if user already exists
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if not user:
        # Sign up user automatically on-the-fly
        # Hash the password if provided, otherwise a dummy password
        if request.password:
            password_hash = auth.get_password_hash(request.password)
        else:
            password_hash = auth.get_password_hash(f"dummy-{random.randint(1000000, 9999999)}")
        display_name = request.name if request.name else request.email.split('@')[0]
        
        user = models.User(
            email=request.email,
            name=display_name,
            password_hash=password_hash,
            role=request.role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # If creator, initialize stats record
        if user.role == "creator":
            stats = models.CreatorStats(creator_id=user.id, monthly_views=0, revenue_earned=0.0)
            db.add(stats)
            db.commit()
            
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role, "user_id": user.id}
    )
    return {"access_token": access_token, "token_type": "bearer"}
