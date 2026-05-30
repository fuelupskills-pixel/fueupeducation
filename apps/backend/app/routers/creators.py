from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/creator", tags=["Creators"])

@router.get("/stats", response_model=schemas.CreatorStatsOut)
def get_creator_stats(
    current_user: models.User = Depends(auth.require_role(["creator"])),
    db: Session = Depends(database.get_db)
):
    stats = db.query(models.CreatorStats).filter(models.CreatorStats.creator_id == current_user.id).first()
    if not stats:
        # Initialize stats on the fly if missing
        stats = models.CreatorStats(creator_id=current_user.id, monthly_views=0, revenue_earned=0.0)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    return stats

@router.get("/courses", response_model=List[schemas.CourseOut])
def get_creator_courses(
    current_user: models.User = Depends(auth.require_role(["creator"])),
    db: Session = Depends(database.get_db)
):
    return db.query(models.Course).filter(models.Course.creator_id == current_user.id).all()

@router.post("/stats/simulate-earnings", response_model=schemas.CreatorStatsOut)
def simulate_earnings(
    views_add: int,
    revenue_add: float,
    current_user: models.User = Depends(auth.require_role(["creator"])),
    db: Session = Depends(database.get_db)
):
    stats = db.query(models.CreatorStats).filter(models.CreatorStats.creator_id == current_user.id).first()
    if not stats:
        stats = models.CreatorStats(creator_id=current_user.id, monthly_views=0, revenue_earned=0.0)
        db.add(stats)
    
    stats.monthly_views += views_add
    stats.revenue_earned += revenue_add
    db.commit()
    db.refresh(stats)
    return stats
