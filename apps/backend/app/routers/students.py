from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from .. import database, models, schemas, auth

router = APIRouter(prefix="/student", tags=["Students"])

@router.post("/enroll/{course_id}", response_model=schemas.EnrollmentOut, status_code=status.HTTP_201_CREATED)
def enroll_course(
    course_id: int,
    current_user: models.User = Depends(auth.require_role(["student", "creator", "admin"])),
    db: Session = Depends(database.get_db)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    existing = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()
    
    if existing:
        return existing
    
    new_enrollment = models.Enrollment(
        student_id=current_user.id,
        course_id=course_id,
        progress_pct=0.0
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.get("/enrollments", response_model=List[schemas.EnrollmentOut])
def get_enrollments(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    return db.query(models.Enrollment).filter(models.Enrollment.student_id == current_user.id).all()

@router.post("/attendance", response_model=schemas.AttendanceOut)
def mark_attendance(
    record: schemas.AttendanceBase,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    lecture = db.query(models.Lecture).filter(models.Lecture.id == record.lecture_id).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")
    
    # Check if attendance is already marked
    existing = db.query(models.Attendance).filter(
        models.Attendance.student_id == current_user.id,
        models.Attendance.lecture_id == record.lecture_id
    ).first()
    
    if existing:
        return existing
    
    new_attendance = models.Attendance(
        student_id=current_user.id,
        lecture_id=record.lecture_id
    )
    db.add(new_attendance)
    
    # Update progress percentage for this course
    # Count total lectures in this course
    course_id = lecture.course_id
    total_lectures = db.query(models.Lecture).filter(models.Lecture.course_id == course_id).count()
    
    # Count attended lectures in this course
    attended_lectures = db.query(models.Attendance).join(models.Lecture).filter(
        models.Attendance.student_id == current_user.id,
        models.Lecture.course_id == course_id
    ).count()
    
    # If student is enrolled, update progress
    enrollment = db.query(models.Enrollment).filter(
        models.Enrollment.student_id == current_user.id,
        models.Enrollment.course_id == course_id
    ).first()
    
    if enrollment and total_lectures > 0:
        enrollment.progress_pct = round((attended_lectures / total_lectures) * 100, 2)
        db.commit()
    else:
        db.commit()
        
    db.refresh(new_attendance)
    return new_attendance

@router.post("/quiz/attempt", response_model=schemas.QuizAttemptOut)
def attempt_quiz(
    attempt: schemas.QuizAttemptCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == attempt.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    new_attempt = models.QuizAttempt(
        student_id=current_user.id,
        quiz_id=attempt.quiz_id,
        score=attempt.score,
        total_questions=attempt.total_questions
    )
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)
    return new_attempt

@router.get("/quiz/attempts", response_model=List[schemas.QuizAttemptOut])
def get_quiz_attempts(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    return db.query(models.QuizAttempt).filter(models.QuizAttempt.student_id == current_user.id).all()
