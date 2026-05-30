# FuelUp Education - World-Class AI Education Ecosystem

FuelUp Education is an autonomous, multi-agent AI framework and enterprise education platform designed to execute curriculum design, content publishing, creator operations, and student engagement models.

---

## 🚀 Key Ecosystem Features

### 1. Multilingual Learning Experience
* **Localization Engine**: Dynamic interface translation supporting **English (EN)**, **Español (ES)**, **हिन्दी (HI)**, **Français (FR)**, and **العربية (AR)**.
* **RTL Layout Support**: Selecting Arabic automatically shifts the layout direction (`dir="rtl"`) for native right-to-left rendering.
* **Content Translation**: Syllabus headers, lecture notes, video descriptions, and transcripts translate seamlessly with a single click.

### 2. Timed Certification Exam Center
* Timed exams (e.g. *Planetary Physics Certification Exam*) with a live 5-minute countdown progress indicator.
* Sleek question-tracker navigation grid (showing skipped, answered, and active questions).
* Automated submission safeguards if the timer expires.
* Instant score calculations and detailed, localized performance summaries.

### 3. Gold-Standard Accredited Certificate
* Dynamic inline SVG rendering of a premium vector completion certificate personalized with:
  * Student's name and course title.
  * Gold border details, corner scrolls, signatures, verification IDs, and metallic gold badges.
* Integrated printing module that launches an isolated browser print window, allowing students to save the document directly as a high-resolution PDF or print it.

### 4. Rich Learning & Study Modules
* **Interactive 3D Flashcards**: Study deck featuring cards that flip with 3D perspectives on click (Term on front, Definition on back). Tracks mastery completion.
* **Astrophysical Formula Sheets**: Quick reference drawer containing key mathematical equations (like Newton's Universal Gravitation: `F = G * (m1 * m2) / r²`) with detailed description details.
* **Lecture Transcripts**: Multi-language subtitles/transcripts synced to the active lecture.

### 5. Multi-Agent AI Architecture (Simulation)
* Simulated background console demonstrating interactive agent communication:
  * **Project Management Agent** tracks sprint roadmaps.
  * **Architecture Analysis Agent** reviews API quality.
  * **QC Agent** triggers automated testing.
  * **Content Automation Agent** processes video scripts.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 13 (App Router), React 18, Tailwind-free CSS variables for precise UI customization, Lucide Icons.
* **Backend**: FastAPI (Python 3.10+), SQLAlchemy, SQLite, Pydantic validations.
* **Design Language**: Immersive dark mode, custom glassmorphism borders (`backdrop-filter`), radial gold gradients, and CSS micro-animations.

---

## 💻 Local Development Setup

### 1. Pre-requisites
* Node.js (v18.x or higher)
* Python (v3.10 or higher)

### 2. Running the Web Frontend
1. Navigate to the web folder:
   ```bash
   cd apps/web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app at **[http://localhost:3000](http://localhost:3000)**.

> [!NOTE]
> The login portal contains an **Offline Mock Fallback**. If the backend server is offline, you can type **any email** (e.g., `student@fuelup.com`) and **any password** to authenticate and immediately access the student dashboard.

### 3. Running the Python Backend
1. Navigate to the backend folder:
   ```bash
   cd apps/backend
   ```
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the API server:
   ```bash
   uvicorn app.main:app --reload
   ```
4. The server runs on **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.
