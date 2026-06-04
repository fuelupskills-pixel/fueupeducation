import os
import json
from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app import database, models, schemas, auth
from app.library_tasks import discover_syllabus_task, discover_open_books_task, copyright_validator_task, ai_summarizer_task

router = APIRouter(prefix="/library", tags=["National Knowledge Library Services"])

# Pydantic schemas for request payloads
class SearchRequest(BaseModel):
    query: str
    board_id: Optional[int] = None
    grade_id: Optional[int] = None
    subject_id: Optional[int] = None
    type: Optional[str] = None  # Book, PDF, Video, Notes, Quiz, Research Paper
    semantic: Optional[bool] = False

class TriggerCrawlerRequest(BaseModel):
    type: str  # syllabus, books
    name: str  # CBSE, Mathematics
    detail: str  # Class 10, Grade 10

class ContextualDoubtRequest(BaseModel):
    selected_text: str
    question: str
    topic_id: int

class ModerationRequest(BaseModel):
    object_id: int
    action: str  # Approve, Reject

class UploadContentRequest(BaseModel):
    title: str
    type: str  # Book, Video, Notes, Research Paper, Question Paper
    url: str
    author: Optional[str] = None
    publisher: Optional[str] = None
    license_type: Optional[str] = "CC-BY"

# 1. GET /boards - Get school boards
@router.get("/boards")
def get_boards(db: Session = Depends(database.get_db)):
    boards = db.query(models.Board).filter(models.Board.type == "school").all()
    # If empty, return seed default
    if not boards:
        return [
            {"id": 1, "name": "CBSE", "type": "school"},
            {"id": 2, "name": "ICSE", "type": "school"},
            {"id": 3, "name": "NIOS", "type": "school"}
        ]
    return boards

# 2. GET /universities - Get UGC Universities & AICTE Colleges
@router.get("/universities")
def get_universities(db: Session = Depends(database.get_db)):
    univs = db.query(models.Board).filter(models.Board.type == "university").all()
    if not univs:
        return [
            {"id": 4, "name": "Delhi University (DU)", "type": "university"},
            {"id": 5, "name": "IIT Bombay", "type": "university"},
            {"id": 6, "name": "IGNOU", "type": "university"}
        ]
    return univs

# 3. GET /subjects - Get subjects filtered by Grade/Class ID
@router.get("/subjects")
def get_subjects(grade_id: Optional[int] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Subject)
    if grade_id:
        query = query.filter(models.Subject.grade_id == grade_id)
    subjects = query.all()
    if not subjects:
        return [
            {"id": 1, "name": "Mathematics", "grade_id": grade_id or 1},
            {"id": 2, "name": "Science", "grade_id": grade_id or 1},
            {"id": 3, "name": "Social Science", "grade_id": grade_id or 1}
        ]
    return subjects

# 4. GET /chapters - Get chapters for a subject
@router.get("/chapters")
def get_chapters(subject_id: Optional[int] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Chapter)
    if subject_id:
        query = query.filter(models.Chapter.subject_id == subject_id)
    chapters = query.all()
    if not chapters:
        return [
            {"id": 1, "title": "Chapter 1: Real Numbers", "chapter_order": 1, "subject_id": subject_id or 1},
            {"id": 2, "title": "Chapter 2: Polynomials", "chapter_order": 2, "subject_id": subject_id or 1}
        ]
    return chapters

# Helper function to get learning objects by category
def fetch_learning_objects(obj_type: str, db: Session):
    objs = db.query(models.LearningObject).filter(
        models.LearningObject.type == obj_type,
        models.LearningObject.license_status == "Approved"
    ).all()
    return objs

# 5. GET /books - Fetch textbooks
@router.get("/books")
def get_books(db: Session = Depends(database.get_db)):
    books = fetch_learning_objects("Book", db)
    if not books:
        return [
            {
                "id": 101, "title": "NCERT Mathematics Class 10", "type": "Book", 
                "url": "https://fuelup-cdn.education/books/ncert_math_class10.pdf",
                "author": "NCERT", "publisher": "NCERT India", "license_type": "Creative Commons BY-NC 4.0",
                "metadata_json": '{"language": "en", "pages": 298}'
            }
        ]
    return books

# 6. GET /videos - Fetch lecture clips
@router.get("/videos")
def get_videos(db: Session = Depends(database.get_db)):
    videos = fetch_learning_objects("Video", db)
    if not videos:
        return [
            {
                "id": 102, "title": "Real Numbers Concept Explainer", "type": "Video",
                "url": "https://www.youtube.com/embed/tgbNymZ7vqY",
                "author": "Swayam Platform", "publisher": "IIT Madras", "license_type": "Open Access",
                "metadata_json": '{"duration_minutes": 15}'
            }
        ]
    return videos

# 7. GET /question-papers - Previous Year Question Papers
@router.get("/question-papers")
def get_question_papers(db: Session = Depends(database.get_db)):
    papers = fetch_learning_objects("Question Paper", db)
    if not papers:
        return [
            {
                "id": 103, "title": "CBSE Class 10 Mathematics Paper 2025", "type": "Question Paper",
                "url": "https://fuelup-cdn.education/papers/cbse_math_2025.pdf",
                "author": "CBSE Board", "publisher": "CBSE Exam Board", "license_type": "Open Access",
                "metadata_json": '{"year": 2025, "duration_hours": 3}'
            }
        ]
    return papers

# 8. GET /notes - Custom study notes
@router.get("/notes")
def get_notes(db: Session = Depends(database.get_db)):
    notes = fetch_learning_objects("Notes", db)
    if not notes:
        return [
            {
                "id": 104, "title": "Real Numbers Quick Summary Notes", "type": "Notes",
                "url": "https://fuelup-cdn.education/notes/real_numbers_notes.pdf",
                "author": "IGNOU", "publisher": "IGNOU Open Repository", "license_type": "CC-BY",
                "metadata_json": '{"language": "hi", "summary": "वास्तविक संख्याओं की त्वरित समीक्षा"}'
            }
        ]
    return notes

# 9. GET /research-papers - UGC academic research papers
@router.get("/research-papers")
def get_research_papers(db: Session = Depends(database.get_db)):
    papers = fetch_learning_objects("Research Paper", db)
    if not papers:
        return [
            {
                "id": 105, "title": "Analysis of Prime Number Distributions", "type": "Research Paper",
                "url": "https://fuelup-cdn.education/research/prime_dist.pdf",
                "author": "Dr. R. Ramanujan", "publisher": "IISc Journal", "license_type": "UGC Open Access",
                "metadata_json": '{"citations": 12, "year": 2024}'
            }
        ]
    return papers

# 10. POST /search - Universal and semantic AI Search
@router.post("/search")
def search_library(req: SearchRequest, db: Session = Depends(database.get_db)):
    query_lower = req.query.lower()
    
    # 1. Base Query
    base_query = db.query(models.LearningObject)
    
    # 2. Hierarchy Filters (Real DB check if objects are present)
    if req.type:
        base_query = base_query.filter(models.LearningObject.type == req.type)
        
    results = base_query.filter(models.LearningObject.license_status == "Approved").all()
    
    # 3. Simple Mock NLP Semantic Matching Heuristic
    # In production, we run vector search using Qdrant or pgvector: 
    # db.query(models.LearningObject).order_by(models.LearningObject.embedding.cosine_distance(query_vector)).limit(10)
    matched = []
    for item in results:
        if query_lower in item.title.lower() or query_lower in item.metadata_json.lower():
            matched.append(item)
            
    # If database is empty, return smart mock matching results
    if not matched:
        all_mocks = [
            {
                "id": 201, "title": "Thermodynamics and Heat Engines", "type": "Book", 
                "url": "https://fuelup-cdn.education/books/thermodynamics.pdf", "author": "UGC Press", 
                "license_status": "Approved", "license_type": "CC-BY", "metadata_json": "thermodynamics books physics"
            },
            {
                "id": 202, "title": "UPSC Civil Services Economics Paper 2024", "type": "Question Paper", 
                "url": "https://fuelup-cdn.education/papers/upsc_econ_2024.pdf", "author": "UPSC Board", 
                "license_status": "Approved", "license_type": "Public Domain", "metadata_json": "upsc economics previous year papers"
            },
            {
                "id": 203, "title": "NCERT Class 10 Real Numbers Video Concept Review", "type": "Video", 
                "url": "https://www.youtube.com/embed/tgbNymZ7vqY", "author": "NCERT Library", 
                "license_status": "Approved", "license_type": "Open License", "metadata_json": "ncert chapter videos mathematics"
            }
        ]
        for mock in all_mocks:
            if query_lower in mock["title"].lower() or query_lower in mock["metadata_json"].lower() or any(w in mock["metadata_json"].lower() for w in query_lower.split()):
                matched.append(mock)
                
    return matched

# 11. POST /doubts/contextual - Interactive Contextual Doubts inside E-Reader
@router.post("/doubts/contextual")
def contextual_doubt(req: ContextualDoubtRequest, current_user: models.User = Depends(auth.get_current_user)):
    """
    Accepts text selection context and returns an instantaneous AI clarification.
    """
    context = req.selected_text
    question = req.question
    
    # Heuristics explanation engine
    explanation = f"Regarding the highlighted section: '{context}'. \n\nHere is a step-by-step breakdown: \n" \
                  f"1. This references the fundamental equation. \n" \
                  f"2. Applying the logic: we solve '{question}' using standard equations. \n" \
                  f"3. Note: Ensure your variables match the SI parameters."
                  
    return {
        "reply": explanation,
        "author": "AI Library Assistant",
        "timestamp": "2026-05-31T11:50:00Z"
    }

# 12. POST /crawlers/trigger - Crawl triggering endpoint
@router.post("/crawlers/trigger", status_code=status.HTTP_202_ACCEPTED)
def trigger_crawler(
    req: TriggerCrawlerRequest,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.require_role(["admin"]))
):
    """
    Trigger syllabus or book discovery scraper agents.
    Falls back to synchronous background tasks if Celery/Redis connection fails.
    """
    try:
        if req.type == "syllabus":
            task_res = discover_syllabus_task.delay(req.name, req.detail)
        else:
            task_res = discover_open_books_task.delay(req.name, req.detail)
        
        return {
            "status": "Queued",
            "task_id": task_res.id,
            "detail": f"Content Discovery Scraper pipeline dispatched to Celery for {req.name} {req.detail}."
        }
    except Exception as e:
        print(f"[CRAWLER CONTROLLER] Celery/Redis connection failed. Falling back to FastAPI BackgroundTasks: {e}")
        if req.type == "syllabus":
            background_tasks.add_task(discover_syllabus_task, req.name, req.detail)
        else:
            background_tasks.add_task(discover_open_books_task, req.name, req.detail)
        
        return {
            "status": "Queued (In-Process Fallback)",
            "task_id": f"fallback_{int(os.getpid())}",
            "detail": f"Content Discovery Scraper pipeline executed via background thread (Redis/Celery was offline)."
        }

# 13. POST /admin/moderate - Content moderation and license validation
@router.post("/admin/moderate")
def moderate_content(req: ModerationRequest, current_user: models.User = Depends(auth.require_role(["admin"])), db: Session = Depends(database.get_db)):
    obj = db.query(models.LearningObject).filter(models.LearningObject.id == req.object_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Learning object not found")
        
    if req.action.lower() == "approve":
        obj.license_status = "Approved"
    elif req.action.lower() == "reject":
        obj.license_status = "Rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'approve' or 'reject'.")
        
    db.commit()
    return {"status": "success", "object_id": obj.id, "license_status": obj.license_status}

# 14. GET /admin/unapproved - Get list of quarantined files for moderation
@router.get("/admin/unapproved")
def get_quarantined_files(current_user: models.User = Depends(auth.require_role(["admin"])), db: Session = Depends(database.get_db)):
    items = db.query(models.LearningObject).filter(models.LearningObject.license_status == "Quarantined").all()
    return items

# 15. POST /admin/upload - Manually upload and approve content (Books, Videos)
@router.post("/admin/upload", status_code=status.HTTP_201_CREATED)
def upload_content_manually(req: UploadContentRequest, current_user: models.User = Depends(auth.require_role(["admin"])), db: Session = Depends(database.get_db)):
    """
    Allows admin to upload books/videos directly. Auto-approves the resource.
    """
    import datetime
    new_obj = models.LearningObject(
        title=req.title,
        type=req.type,
        url=req.url,
        author=req.author,
        publisher=req.publisher,
        license_type=req.license_type,
        license_status="Approved",  # Manually uploaded is auto-approved
        metadata_json=json.dumps({
            "uploaded_by": current_user.email,
            "upload_time": str(datetime.datetime.utcnow())
        })
    )
    db.add(new_obj)
    db.commit()
    db.refresh(new_obj)
    return {"status": "success", "object_id": new_obj.id, "title": new_obj.title}
