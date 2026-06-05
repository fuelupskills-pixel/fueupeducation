from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    user_id: Optional[int] = None

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: str = "student" # student, creator, admin

class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Lecture Schemas ---
class LectureBase(BaseModel):
    title: str
    duration: str = "0m"
    video_url: Optional[str] = None
    lecture_order: int = 0
    notes: Optional[str] = None

class LectureCreate(LectureBase):
    pass

class LectureOut(LectureBase):
    id: int
    course_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Course Schemas ---
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    image_url: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: int
    creator_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class CourseDetailOut(CourseOut):
    creator_name: Optional[str] = None
    lectures: List[LectureOut] = []

    class Config:
        from_attributes = True

# --- Enrollment Schemas ---
class EnrollmentOut(BaseModel):
    id: int
    student_id: int
    course_id: int
    enrolled_at: datetime.datetime
    progress_pct: float
    course: Optional[CourseOut] = None

    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    lecture_id: int

class AttendanceOut(BaseModel):
    id: int
    student_id: int
    lecture_id: int
    marked_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Quiz Schemas ---
class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_option_index: int

class QuizBase(BaseModel):
    title: str
    questions_json: str # Stringified list of QuizQuestion objects

class QuizCreate(QuizBase):
    pass

class QuizOut(QuizBase):
    id: int
    lecture_id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class QuizAttemptCreate(BaseModel):
    quiz_id: int
    score: int
    total_questions: int

class QuizAttemptOut(BaseModel):
    id: int
    student_id: int
    quiz_id: int
    score: int
    total_questions: int
    completed_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Creator Dashboard Schemas ---
class CreatorStatsOut(BaseModel):
    monthly_views: int
    revenue_earned: float
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

# --- OTP Schemas ---
class OTPSend(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str
    name: Optional[str] = None
    role: str = "student" # student, creator, admin
    password: Optional[str] = None
