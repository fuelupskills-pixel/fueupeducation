from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/", response_model=List[schemas.CourseOut])
def list_courses(db: Session = Depends(database.get_db)):
    return db.query(models.Course).all()

@router.post("/", response_model=schemas.CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    course: schemas.CourseCreate,
    current_user: models.User = Depends(auth.require_role(["creator", "admin"])),
    db: Session = Depends(database.get_db)
):
    new_course = models.Course(
        title=course.title,
        description=course.description,
        category=course.category,
        image_url=course.image_url,
        creator_id=current_user.id
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/{course_id}", response_model=schemas.CourseDetailOut)
def get_course(course_id: int, db: Session = Depends(database.get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Attach creator name
    creator_name = course.creator.name if course.creator else "Unknown Creator"
    
    # Sort lectures by order
    sorted_lectures = sorted(course.lectures, key=lambda x: x.lecture_order)
    
    return schemas.CourseDetailOut(
        id=course.id,
        title=course.title,
        description=course.description,
        category=course.category,
        image_url=course.image_url,
        creator_id=course.creator_id,
        created_at=course.created_at,
        creator_name=creator_name,
        lectures=sorted_lectures
    )

@router.post("/{course_id}/lectures", response_model=schemas.LectureOut, status_code=status.HTTP_201_CREATED)
def add_lecture(
    course_id: int,
    lecture: schemas.LectureCreate,
    current_user: models.User = Depends(auth.require_role(["creator", "admin"])),
    db: Session = Depends(database.get_db)
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="You do not own this course")
    
    new_lecture = models.Lecture(
        course_id=course_id,
        title=lecture.title,
        duration=lecture.duration,
        video_url=lecture.video_url,
        lecture_order=lecture.lecture_order,
        notes=lecture.notes
    )
    db.add(new_lecture)
    db.commit()
    db.refresh(new_lecture)
    return new_lecture
