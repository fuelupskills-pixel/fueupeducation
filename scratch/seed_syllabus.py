import os
import sys
import json
import sqlite3

# Ensure we can import app modules if needed, or use raw sqlite3 for robustness
db_path = r"d:\fuelup education\apps\backend\fuelup.db"

def seed_database():
    print(f"Connecting to database at {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Ensure India country exists
    cursor.execute("SELECT id FROM countries WHERE name = ?", ("India",))
    country_row = cursor.fetchone()
    if country_row:
        country_id = country_row[0]
    else:
        cursor.execute("INSERT INTO countries (name) VALUES (?)", ("India",))
        country_id = cursor.lastrowid
        print(f"Created Country: India (ID: {country_id})")

    # 2. Insert States
    states = [
        "National Capital Territory of Delhi",
        "Uttar Pradesh",
        "Maharashtra",
        "Bihar",
        "Tamil Nadu",
        "Karnataka",
        "West Bengal"
    ]
    state_ids = {}
    for state_name in states:
        cursor.execute("SELECT id FROM states WHERE name = ?", (state_name,))
        state_row = cursor.fetchone()
        if state_row:
            state_ids[state_name] = state_row[0]
        else:
            cursor.execute("INSERT INTO states (name, country_id) VALUES (?, ?)", (state_name, country_id))
            state_ids[state_name] = cursor.lastrowid
            print(f"Created State: {state_name} (ID: {state_ids[state_name]})")

    # 3. Insert Boards
    boards_data = [
        ("CBSE", "school", state_ids["National Capital Territory of Delhi"]),
        ("ICSE", "school", state_ids["National Capital Territory of Delhi"]),
        ("NIOS", "school", state_ids["National Capital Territory of Delhi"]),
        ("UPMSP (UP Board)", "school", state_ids["Uttar Pradesh"]),
        ("MSBSHSE (Maharashtra Board)", "school", state_ids["Maharashtra"]),
        ("BSEB (Bihar Board)", "school", state_ids["Bihar"]),
        ("TNDGE (Tamil Nadu Board)", "school", state_ids["Tamil Nadu"]),
        ("KSEEB (Karnataka Board)", "school", state_ids["Karnataka"]),
        ("WBBSE (West Bengal Board)", "school", state_ids["West Bengal"])
    ]
    board_ids = {}
    for name, b_type, s_id in boards_data:
        cursor.execute("SELECT id FROM boards WHERE name = ?", (name,))
        board_row = cursor.fetchone()
        if board_row:
            board_ids[name] = board_row[0]
        else:
            cursor.execute("INSERT INTO boards (name, type, state_id) VALUES (?, ?, ?)", (name, b_type, s_id))
            board_ids[name] = cursor.lastrowid
            print(f"Created Board: {name} (ID: {board_ids[name]})")

    # 4. Insert Syllabus Learning Objects
    # We will generate a rich set of syllabi across Class 9, 10, 11, and 12
    syllabi = []
    
    # CBSE Syllabi
    for grade in ["Class 9", "Class 10", "Class 11", "Class 12"]:
        for subject in ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "Social Science", "English"]:
            syllabi.append({
                "title": f"CBSE {grade} {subject} Syllabus & Curriculum Guide 2026-27",
                "type": "Book",
                "url": f"https://fuelup-cdn.education/syllabus/cbse_{grade.lower().replace(' ', '')}_{subject.lower()}_syllabus.pdf",
                "license_status": "Approved",
                "license_type": "Government Open Data License (India)",
                "author": "Central Board of Secondary Education",
                "publisher": "CBSE Academic Press",
                "metadata_json": json.dumps({
                    "board": "CBSE",
                    "grade": grade,
                    "subject": subject,
                    "academic_year": "2026-2027",
                    "type": "Syllabus"
                })
            })

    # State Boards Syllabi
    state_board_names = [
        ("UPMSP (UP Board)", "Uttar Pradesh Madhyamik Shiksha Parishad"),
        ("MSBSHSE (Maharashtra Board)", "Maharashtra State Board of Secondary and Higher Secondary Education"),
        ("BSEB (Bihar Board)", "Bihar School Examination Board"),
        ("TNDGE (Tamil Nadu Board)", "Tamil Nadu Directorate of Government Examinations"),
        ("KSEEB (Karnataka Board)", "Karnataka Secondary Education Examination Board"),
        ("WBBSE (West Bengal Board)", "West Bengal Board of Secondary Education")
    ]

    for short_name, long_name in state_board_names:
        for grade in ["Class 10", "Class 12"]:
            for subject in ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "Social Science"]:
                syllabi.append({
                    "title": f"{short_name} {grade} {subject} Syllabus & Exam Pattern 2026-27",
                    "type": "Book",
                    "url": f"https://fuelup-cdn.education/syllabus/{short_name.split()[0].lower()}_{grade.lower().replace(' ', '')}_{subject.lower()}_syllabus.pdf",
                    "license_status": "Approved",
                    "license_type": "Government Open Data License (India)",
                    "author": long_name,
                    "publisher": "State Government Press",
                    "metadata_json": json.dumps({
                        "board": short_name,
                        "grade": grade,
                        "subject": subject,
                        "academic_year": "2026-2027",
                        "type": "Syllabus"
                    })
                })

    # Insert syllabi if not exist
    inserted_count = 0
    for syllabus in syllabi:
        cursor.execute("SELECT id FROM learning_objects WHERE title = ?", (syllabus["title"],))
        exist_row = cursor.fetchone()
        if not exist_row:
            cursor.execute("""
                INSERT INTO learning_objects (title, type, url, license_status, license_type, author, publisher, metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                syllabus["title"],
                syllabus["type"],
                syllabus["url"],
                syllabus["license_status"],
                syllabus["license_type"],
                syllabus["author"],
                syllabus["publisher"],
                syllabus["metadata_json"]
            ))
            inserted_count += 1

    conn.commit()
    conn.close()
    print(f"Successfully seeded database! Inserted {inserted_count} new syllabus learning objects.")

if __name__ == "__main__":
    seed_database()
