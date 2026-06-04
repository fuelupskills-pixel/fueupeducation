import os
import sys
import json
import datetime
from app.celery_app import celery_app
from app.database import SessionLocal
from app import models

# Celery task definitions for content discovery, metadata validation, licensing and AI generation

@celery_app.task(name="app.library_tasks.discover_syllabus_task")
def discover_syllabus_task(board_name: str, grade_name: str):
    """
    Crawls and discovers syllabus, curriculum, and academic calendar metadata from boards.
    """
    print(f"[CRAWLER] Starting syllabus discovery for Board: {board_name}, Grade: {grade_name}")
    db = SessionLocal()
    try:
        # Check Country & State
        country = db.query(models.Country).filter(models.Country.name == "India").first()
        if not country:
            country = models.Country(name="India")
            db.add(country)
            db.commit()
            db.refresh(country)
        
        state = db.query(models.State).filter(models.State.name == "Delhi").first()
        if not state:
            state = models.State(name="Delhi", country_id=country.id)
            db.add(state)
            db.commit()
            db.refresh(state)

        # Check Board
        board = db.query(models.Board).filter(models.Board.name == board_name).first()
        if not board:
            board = models.Board(name=board_name, type="school", state_id=state.id)
            db.add(board)
            db.commit()
            db.refresh(board)
        
        # Check Grade
        grade = db.query(models.GradeLevel).filter(models.GradeLevel.name == grade_name, models.GradeLevel.board_id == board.id).first()
        if not grade:
            grade = models.GradeLevel(name=grade_name, board_id=board.id)
            db.add(grade)
            db.commit()
            db.refresh(grade)

        # Create mock Syllabus Learning Object
        # In real life this downloads a PDF and pushes metadata
        new_obj = models.LearningObject(
            title=f"Official {board_name} {grade_name} Curriculum and Syllabus Guide",
            type="PDF",
            url=f"https://fuelup-cdn.education/syllabus/{board_name.lower()}_{grade_name.replace(' ', '').lower()}_syllabus.pdf",
            license_status="Quarantined",
            license_type="Government Open Data License (India)",
            author="National Education Board Council",
            publisher="Government Press",
            metadata_json=json.dumps({
                "source_url": "https://cbse.gov.in/curriculum-archive",
                "file_size_bytes": 1048576,
                "academic_year": "2026-2027"
            })
        )
        db.add(new_obj)
        db.commit()
        db.refresh(new_obj)

        print(f"[CRAWLER] Successfully discovered syllabus metadata. Learning Object ID: {new_obj.id}")
        return {"status": "success", "learning_object_id": new_obj.id, "title": new_obj.title}
    except Exception as e:
        print(f"[CRAWLER] Discover syllabus failed: {e}")
        db.rollback()
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()

@celery_app.task(name="app.library_tasks.discover_open_books_task")
def discover_open_books_task(subject_name: str, grade_name: str):
    """
    Scrapes metadata of public domain books, NCERT textbooks, or open university books.
    """
    print(f"[CRAWLER] Starting book scraper for {subject_name} ({grade_name})")
    db = SessionLocal()
    try:
        # Resolve hierarchy
        board = db.query(models.Board).filter(models.Board.name == "CBSE").first()
        if not board:
            return {"status": "failed", "error": "CBSE board must exist first."}
        
        grade = db.query(models.GradeLevel).filter(models.GradeLevel.name == grade_name, models.GradeLevel.board_id == board.id).first()
        if not grade:
            grade = models.GradeLevel(name=grade_name, board_id=board.id)
            db.add(grade)
            db.commit()
            db.refresh(grade)

        subject = db.query(models.Subject).filter(models.Subject.name == subject_name, models.Subject.grade_id == grade.id).first()
        if not subject:
            subject = models.Subject(name=subject_name, grade_id=grade.id)
            db.add(subject)
            db.commit()
            db.refresh(subject)

        # Create a mock textbook chapter
        chapter = db.query(models.Chapter).filter(models.Chapter.title == "Chapter 1: Real Numbers", models.Chapter.subject_id == subject.id).first()
        if not chapter:
            chapter = models.Chapter(title="Chapter 1: Real Numbers", chapter_order=1, subject_id=subject.id)
            db.add(chapter)
            db.commit()
            db.refresh(chapter)

        topic = db.query(models.Topic).filter(models.Topic.name == "Euclid's Division Lemma", models.Topic.chapter_id == chapter.id).first()
        if not topic:
            topic = models.Topic(name="Euclid's Division Lemma", chapter_id=chapter.id)
            db.add(topic)
            db.commit()
            db.refresh(topic)

        # Add open textbook learning object
        new_book = models.LearningObject(
            topic_id=topic.id,
            title=f"NCERT Mathematics {grade_name} - Chapter 1 Real Numbers",
            type="Book",
            url=f"https://fuelup-cdn.education/books/ncert_math_{grade_name.replace(' ', '').lower()}_ch1.pdf",
            license_status="Quarantined",
            license_type="Creative Commons BY-NC-SA 4.0",
            author="NCERT Textbook Committee",
            publisher="NCERT India",
            metadata_json=json.dumps({
                "isbn": "978-81-7450-489-0",
                "number_of_pages": 24,
                "language": "en"
            })
        )
        db.add(new_book)
        db.commit()
        db.refresh(new_book)

        print(f"[CRAWLER] Discovered open book. ID: {new_book.id}")
        return {"status": "success", "learning_object_id": new_book.id, "title": new_book.title}
    except Exception as e:
        print(f"[CRAWLER] Discover open books failed: {e}")
        db.rollback()
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()

@celery_app.task(name="app.library_tasks.copyright_validator_task")
def copyright_validator_task(object_id: int):
    """
    Copyright validation task. Analyzes licensing headers and moves approved objects out of quarantine.
    """
    print(f"[LICENSE] Validating licensing and permissions for Object ID: {object_id}")
    db = SessionLocal()
    try:
        obj = db.query(models.LearningObject).filter(models.LearningObject.id == object_id).first()
        if not obj:
            return {"status": "failed", "error": f"LearningObject {object_id} not found"}

        license_type = obj.license_type.lower()
        if "cc" in license_type or "public domain" in license_type or "government" in license_type or "open" in license_type:
            obj.license_status = "Approved"
            result = "Approved"
        else:
            obj.license_status = "Rejected"
            result = "Rejected"

        db.commit()
        print(f"[LICENSE] Auto-Validation Complete. Status of {obj.title}: {result}")
        return {"status": "success", "object_id": object_id, "license_status": result}
    except Exception as e:
        print(f"[LICENSE] Validation error: {e}")
        db.rollback()
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()

@celery_app.task(name="app.library_tasks.ai_summarizer_task")
def ai_summarizer_task(chapter_id: int):
    """
    Asynchronously builds summaries,MCQs, Formula sheets and translations for the chapter content.
    """
    print(f"[AI PIPELINE] Generating summaries & study guides for Chapter ID: {chapter_id}")
    db = SessionLocal()
    try:
        chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
        if not chapter:
            return {"status": "failed", "error": "Chapter not found"}

        # Simulate local quantized vLLM model generations
        summaries = {
            "en": {
                "summary": f"This chapter covers the properties and calculations regarding {chapter.title}.",
                "concepts": ["Fundamental Theorem of Arithmetic", "Euclidean Algorithm", "Rational and Irrational Numbers"],
                "revision_notes": "Real numbers comprise rational and irrational quotients. Primes are the foundation blocks of arithmetic factorization.",
                "formula_sheet": "HCF(a, b) * LCM(a, b) = a * b"
            },
            "hi": {
                "summary": f"यह अध्याय {chapter.title} के बारे में प्रमुख अवधारणाओं को प्रस्तुत करता है।",
                "concepts": ["अंकगणित का मूलभूत सिद्धांत", "यूक्लिडियन एल्गोरिथम", "परिमेय और अपरिमेय संख्याएँ"],
                "revision_notes": "वास्तविक संख्याओं में परिमेय और अपरिमेय दोनों संख्याएँ शामिल हैं।",
                "formula_sheet": "महत्तम समापवर्तक (HCF) * लघुत्तम समापवर्त्य (LCM) = a * b"
            }
        }

        # Save summaries as notes inside a learning object for the topics of this chapter
        topics = db.query(models.Topic).filter(models.Topic.chapter_id == chapter_id).all()
        for topic in topics:
            # Save AI generated MCQ Quiz
            mock_mcqs = [
                {"question": "For any two positive integers a and b, HCF(a,b) * LCM(a,b) equals:", "options": ["a + b", "a * b", "a / b", "None"], "correct": 1},
                {"question": "Which of the following is an irrational number?", "options": ["2.0", "3/4", "Square root of 2", "9"], "correct": 2}
            ]
            
            # Save English Summary Object
            en_summary = models.LearningObject(
                topic_id=topic.id,
                title=f"AI Summary & Mindmap - {topic.name} (English)",
                type="Notes",
                url=f"https://fuelup-cdn.education/notes/ai_{topic.id}_en.json",
                license_status="Approved",
                license_type="Creative Commons BY-ND 4.0",
                author="FuelUp Knowledge Synthesizer Engine",
                metadata_json=json.dumps({
                    "summary": summaries["en"]["summary"],
                    "key_concepts": summaries["en"]["concepts"],
                    "revision_notes": summaries["en"]["revision_notes"],
                    "formula_sheet": summaries["en"]["formula_sheet"],
                    "flashcards": [
                        {"front": "Real Number", "back": "A value that represents any quantity along a continuous line."},
                        {"front": "Prime Number", "back": "A number greater than 1 that has no positive divisors other than 1 and itself."}
                    ]
                })
            )
            db.add(en_summary)

            # Save Hindi Translation Object
            hi_summary = models.LearningObject(
                topic_id=topic.id,
                title=f"AI Summary & Mindmap - {topic.name} (Hindi)",
                type="Notes",
                url=f"https://fuelup-cdn.education/notes/ai_{topic.id}_hi.json",
                license_status="Approved",
                license_type="Creative Commons BY-ND 4.0",
                author="FuelUp Knowledge Synthesizer Engine",
                metadata_json=json.dumps({
                    "summary": summaries["hi"]["summary"],
                    "key_concepts": summaries["hi"]["concepts"],
                    "revision_notes": summaries["hi"]["revision_notes"],
                    "formula_sheet": summaries["hi"]["formula_sheet"],
                    "flashcards": [
                        {"front": "वास्तविक संख्या", "back": "वह संख्या जिसका मान एक सतत रेखा पर किसी भी मात्रा को दर्शाता है।"},
                        {"front": "अभाज्य संख्या", "back": "1 से बड़ी वह संख्या जिसके 1 और स्वयं के अलावा कोई अन्य गुणनखंड न हों।"}
                    ]
                })
            )
            db.add(hi_summary)

            # Save Quiz object
            new_quiz = models.LearningObject(
                topic_id=topic.id,
                title=f"AI Practice Quiz: {topic.name}",
                type="Quiz",
                url=f"https://fuelup-cdn.education/quizzes/ai_{topic.id}.json",
                license_status="Approved",
                license_type="Creative Commons BY-ND 4.0",
                author="FuelUp Quiz Generator",
                metadata_json=json.dumps(mock_mcqs)
            )
            db.add(new_quiz)

        db.commit()
        print(f"[AI PIPELINE] AI compilation complete for Chapter ID: {chapter_id}")
        return {"status": "success", "chapter_id": chapter_id}
    except Exception as e:
        print(f"[AI PIPELINE] AI generation failed: {e}")
        db.rollback()
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()
