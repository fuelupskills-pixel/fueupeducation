from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="student") # student, creator, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    courses = relationship("Course", back_populates="creator")
    enrollments = relationship("Enrollment", back_populates="student")
    attendance_records = relationship("Attendance", back_populates="student")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    creator = relationship("User", back_populates="courses")
    lectures = relationship("Lecture", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String, nullable=False)
    duration = Column(String, default="0m")
    video_url = Column(String, nullable=True)
    lecture_order = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="lectures")
    attendance = relationship("Attendance", back_populates="lecture", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lecture", cascade="all, delete-orphan")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    progress_pct = Column(Float, default=0.0)

    # Relationships
    student = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    lecture_id = Column(Integer, ForeignKey("lectures.id"))
    marked_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="attendance_records")
    lecture = relationship("Lecture", back_populates="attendance")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lecture_id = Column(Integer, ForeignKey("lectures.id"))
    title = Column(String, nullable=False)
    questions_json = Column(Text, nullable=False) # JSON list of questions
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    lecture = relationship("Lecture", back_populates="quizzes")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")

class CreatorStats(Base):
    __tablename__ = "creator_stats"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), unique=True)
    monthly_views = Column(Integer, default=0)
    revenue_earned = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


# --- National Knowledge Library (NKL) Educational Hierarchy ---

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    states = relationship("State", back_populates="country")

class State(Base):
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country_id = Column(Integer, ForeignKey("countries.id"))

    country = relationship("Country", back_populates="states")
    boards = relationship("Board", back_populates="state")

class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(String, default="school")  # school, university, competitive
    state_id = Column(Integer, ForeignKey("states.id"), nullable=True)

    state = relationship("State", back_populates="boards")
    grades = relationship("GradeLevel", back_populates="board")

class GradeLevel(Base):
    __tablename__ = "grade_levels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Class 10, B.Tech Sem 1, PhD Core
    board_id = Column(Integer, ForeignKey("boards.id"))

    board = relationship("Board", back_populates="grades")
    subjects = relationship("Subject", back_populates="grade")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    grade_id = Column(Integer, ForeignKey("grade_levels.id"))

    grade = relationship("GradeLevel", back_populates="subjects")
    chapters = relationship("Chapter", back_populates="subject")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    chapter_order = Column(Integer, default=1)
    subject_id = Column(Integer, ForeignKey("subjects.id"))

    subject = relationship("Subject", back_populates="chapters")
    topics = relationship("Topic", back_populates="chapter")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"))

    chapter = relationship("Chapter", back_populates="topics")
    learning_objects = relationship("LearningObject", back_populates="topic")

class LearningObject(Base):
    __tablename__ = "learning_objects"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Book, PDF, Video, Audio, Notes, Quiz, Research Paper, Slides
    url = Column(String, nullable=False)
    license_status = Column(String, default="Quarantined")  # Quarantined, Approved, Rejected
    license_type = Column(String, default="CC-BY")
    author = Column(String, nullable=True)
    publisher = Column(String, nullable=True)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    topic = relationship("Topic", back_populates="learning_objects")

class StudentKnowledgeGraph(Base):
    __tablename__ = "student_knowledge_graph"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    reading_progress = Column(Float, default=0.0)  # 0 to 100
    video_progress = Column(Float, default=0.0)    # 0 to 100
    quiz_score = Column(Float, default=0.0)        # 0 to 100
    skill_level = Column(Float, default=0.0)       # 0.0 to 1.0 (calculated competence)
    last_accessed = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("User")
    topic = relationship("Topic")

