import os
import pytest
from fastapi.testclient import TestClient

# Ensure database is configured
os.environ["DATABASE_URL"] = "sqlite:///./test_fuelup.db"

from app.database import Base, engine
from app.main import app

client = TestClient(app)

def test_library_endpoints():
    # Clean the test database
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. Register a student user and admin user
    # Student
    reg_student = client.post(
        "/api/auth/register",
        json={
            "email": "lib-student@fuelupeducation.com",
            "name": "Library Student",
            "password": "strongpassword123",
            "role": "student"
        }
    )
    assert reg_student.status_code == 201

    # Admin
    reg_admin = client.post(
        "/api/auth/register",
        json={
            "email": "lib-admin@fuelupeducation.com",
            "name": "Library Admin",
            "password": "adminpassword123",
            "role": "admin"
        }
    )
    assert reg_admin.status_code == 201

    # Login to get Student token
    login_stud = client.post(
        "/api/auth/login",
        data={
            "username": "lib-student@fuelupeducation.com",
            "password": "strongpassword123"
        }
    )
    assert login_stud.status_code == 200
    student_token = login_stud.json()["access_token"]

    # Login to get Admin token
    login_adm = client.post(
        "/api/auth/login",
        data={
            "username": "lib-admin@fuelupeducation.com",
            "password": "adminpassword123"
        }
    )
    assert login_adm.status_code == 200
    admin_token = login_adm.json()["access_token"]

    # 2. Test Get Boards and Universities
    boards_res = client.get("/api/library/boards")
    assert boards_res.status_code == 200
    assert len(boards_res.json()) > 0

    univ_res = client.get("/api/library/universities")
    assert univ_res.status_code == 200
    assert len(univ_res.json()) > 0

    # 3. Test Get Subjects and Chapters
    sub_res = client.get("/api/library/subjects?grade_id=1")
    assert sub_res.status_code == 200
    assert len(sub_res.json()) > 0

    chap_res = client.get("/api/library/chapters?subject_id=1")
    assert chap_res.status_code == 200
    assert len(chap_res.json()) > 0

    # 4. Test GET learning object categorizations
    books_res = client.get("/api/library/books")
    assert books_res.status_code == 200

    videos_res = client.get("/api/library/videos")
    assert videos_res.status_code == 200

    papers_res = client.get("/api/library/question-papers")
    assert papers_res.status_code == 200

    notes_res = client.get("/api/library/notes")
    assert notes_res.status_code == 200

    research_res = client.get("/api/library/research-papers")
    assert research_res.status_code == 200

    # 5. Test Search Library
    search_res = client.post(
        "/api/library/search",
        json={
            "query": "thermodynamics",
            "semantic": True
        }
    )
    assert search_res.status_code == 200
    assert len(search_res.json()) > 0

    # 6. Test Contextual Doubt (requires user token)
    doubt_res = client.post(
        "/api/library/doubts/contextual",
        json={
            "selected_text": "Euclid's Division Lemma",
            "question": "What is division lemma?",
            "topic_id": 1
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert doubt_res.status_code == 200
    assert "reply" in doubt_res.json()

    # 7. Test Admin Moderate trigger endpoints
    # Add a mock quarantined book to DB first to verify moderation queue
    from app.database import SessionLocal
    from app.models import LearningObject
    db = SessionLocal()
    mock_quarantine = LearningObject(
        title="Quarantined Scraped Book Guidelines",
        type="Book",
        url="http://quarantine-cdn.com/file.pdf",
        license_status="Quarantined",
        license_type="CC-BY"
    )
    db.add(mock_quarantine)
    db.commit()
    quarantine_id = mock_quarantine.id
    db.close()

    # Get quarantined items list as Admin
    unapproved_res = client.get(
        "/api/library/admin/unapproved",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert unapproved_res.status_code == 200
    assert any(item["id"] == quarantine_id for item in unapproved_res.json())

    # Try accessing unapproved list as Student (should fail 403)
    unapproved_fail = client.get(
        "/api/library/admin/unapproved",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert unapproved_fail.status_code == 403

    # Approve item as Admin
    mod_res = client.post(
        "/api/library/admin/moderate",
        json={
            "object_id": quarantine_id,
            "action": "approve"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert mod_res.status_code == 200
    assert mod_res.json()["license_status"] == "Approved"
