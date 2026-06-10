# Recruitment AI Agent

A full-stack AI-powered recruitment platform for candidates and HR teams. Upload a resume, get an instant ATS compatibility score, chat with your resume using AI, generate interview questions, get improvement suggestions, rewrite your resume for any role, or screen an entire batch of candidates — all in one deployed web application.

**Live:** [https://recruitment-ai-agent-2wo5.onrender.com](https://recruitment-ai-agent-2wo5.onrender.com)

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment](#deployment-rendercom)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [License](#license)

---

## Features

### Candidate Mode

| Feature | Description |
|---------|-------------|
| **ATS Resume Scoring** | Upload your resume and optionally a job description. The AI extracts required skills from the JD (or uses default keywords) and scores your resume 0–100. Shows matched and missing skills. A score ≥ 75 is flagged as "Selected". |
| **AI Chat with Resume** | Ask natural language questions directly about your resume — "What are my strongest skills?", "Does my resume mention React?" — and get instant, context-aware answers. |
| **Interview Question Generator** | Generate tailored interview questions based on your resume. Choose question type (Technical, Behavioral, Situational, Mixed) and difficulty (Easy, Medium, Hard). |
| **Resume Improvement Suggestions** | Select resume sections to review. The AI provides specific, actionable ISSUE / BEFORE / AFTER suggestions for each section. |
| **Improved Resume Generator** | Input a target job role and optionally a JD. The AI rewrites your entire resume in ATS-optimized markdown, tailored to the role. |
| **PDF Download** | Download your AI-generated resume as a professional, formatted A4 PDF (built with ReportLab). |

### HR / Recruiter Mode

| Feature | Description |
|---------|-------------|
| **Bulk Candidate Screening** | Upload 2–N resumes and a job description. The AI extracts required skills from the JD, scores every candidate against them, and returns a ranked list with matched/missing skills per candidate. |
| **Configurable Shortlist** | Choose how many top candidates to shortlist (top N). Candidates scoring ≥ 75 are auto-flagged as Selected. |
| **Screening Report PDF** | Download a professional A4 PDF screening report with a summary table, full rankings, skills detail for top candidates, and color-coded scores (green/amber/red). |
| **Session Save & Restore** | Logged-in HR users can save any screening session to Supabase and restore it later — the full results, JD, and candidate data are preserved. |

### Accounts & Persistence

| Feature | Description |
|---------|-------------|
| **User Registration / Login** | JWT-based auth (HS256, 7-day tokens). Passwords hashed with bcrypt. |
| **Analysis History** | Every ATS analysis run by a logged-in user is saved to Supabase and shown in a side-drawer history panel. |
| **HR Session History** | Saved HR screening sessions are listed in the history panel with one-click restore. |
| **Guest Mode** | The app is fully functional without an account. Guests get 3 free AI uses tracked in localStorage, then a sign-up prompt (GateBanner). No functionality is blocked outright — signing up is optional. |

---

## Architecture

```
Browser (React SPA)
       │
       │  /api/*  (JSON + multipart/form-data)
       ▼
FastAPI Backend (Python 3.11)
       │
       ├── agent.py  ──►  Groq API (llama-3.3-70b-versatile)
       │                  - skill extraction from JDs
       │                  - resume scoring (YES/NO per skill)
       │                  - chat / Q&A
       │                  - question generation
       │                  - improvement suggestions
       │                  - resume rewrite
       │
       ├── database.py ──► Supabase (PostgreSQL)
       │                   - users, analyses, hr_sessions, chat_messages
       │
       └── pdf_utils.py ──► ReportLab
                            - resume PDF (A4, markdown → styled)
                            - screening report PDF (ranked table + skills detail)

In production: FastAPI also serves web/dist/ (built React app)
as static files — one service, no CORS issues.
```

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Backend** | FastAPI 0.111, Python 3.11 | Async, all routes under `/api` prefix |
| **LLM** | Groq API (`llama-3.3-70b-versatile`) | Via `langchain-groq 0.1.9`, `temperature=0` for deterministic output |
| **PDF Parsing** | pypdf 4.2 | Extracts raw text from uploaded PDF resumes |
| **PDF Generation** | ReportLab 4.2 | Professional A4 PDFs — resume + screening report |
| **Auth** | python-jose (JWT HS256) + bcrypt | 7-day tokens, bcrypt 4.x compatible |
| **Database** | Supabase (PostgreSQL) | Optional — app works without it |
| **Frontend** | React 18, Vite, Tailwind CSS | `lucide-react` for icons |
| **Deployment** | Render.com | Single web service, free tier |

---

## Project Structure

```
Recruitment-AI-Agent/
│
├── api.py                  # FastAPI app — all routes under /api/*
│                           # Also serves web/dist/ in production
│
├── agent.py                # ResumeAnalysisAgent class
│                           # All AI logic: scoring, chat, questions,
│                           # improvements, resume generation
│
├── database.py             # Supabase wrapper (fully optional)
│                           # users / analyses / hr_sessions / chat_messages
│
├── pdf_utils.py            # ReportLab PDF generators
│                           # generate_resume_pdf(markdown) → bytes
│                           # generate_screening_report_pdf(data) → bytes
│
├── supabase_schema.sql     # Full DB schema with RLS policies
│                           # Safe to re-run (IF NOT EXISTS guards)
│
├── requirements.txt        # Python dependencies (no torch/sentence-transformers)
├── Procfile                # Render start command
├── nixpacks.toml           # Render build config
├── runtime.txt             # Python 3.11.0 version pin
├── .env                    # Local secrets (never committed)
│
└── web/                    # React frontend (Vite + Tailwind)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx                          # Root — mode routing, overlays
        │
        ├── context/
        │   └── AuthContext.jsx             # JWT auth state + authFetch helper
        │
        ├── hooks/
        │   └── useGuestLimit.js            # 3 free uses gate (localStorage)
        │
        └── components/
            ├── NavBar.jsx                  # Top navigation bar
            ├── Hero.jsx                    # Landing hero section
            ├── Sidebar.jsx                 # Resume + JD file upload panel
            ├── TabNav.jsx                  # Tab bar (Analysis/Chat/etc.)
            ├── ModeSelector.jsx            # Candidate vs HR mode picker
            ├── HRMode.jsx                  # Full HR screening page
            ├── HistoryPanel.jsx            # Side-drawer: analyses + HR sessions
            ├── shared.jsx                  # Shared UI: GateBanner, etc.
            │
            ├── auth/
            │   └── LoginPage.jsx           # Login / Register modal
            │
            └── tabs/
                ├── AnalysisTab.jsx         # ATS scoring results + score ring
                ├── ChatTab.jsx             # Resume Q&A chat interface
                ├── QuestionsTab.jsx        # Interview question generator
                ├── ImprovementsTab.jsx     # Improvement suggestions
                └── GenerateTab.jsx         # Resume rewrite + PDF download
```

---

## Local Development

### Prerequisites

- Python 3.11 (`python --version`)
- Node.js 18+ (`node --version`)
- A [Groq API key](https://console.groq.com) — free tier, no credit card required
- A [Supabase](https://supabase.com) project — optional, only needed for accounts and history

### 1. Clone the repository

```bash
git clone https://github.com/Nosheen24/Recruitment-AI-Agent.git
cd Recruitment-AI-Agent
```

### 2. Set up the Python environment

```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Required
GROQ_API_KEY=gsk_your_groq_api_key_here
SECRET_KEY=a-long-random-string-for-jwt-signing

# Optional — enables user accounts and analysis history
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

> The app runs fine without Supabase — auth endpoints will return 503 and the history panel will be empty, but all AI features work.

### 4. Set up the database (optional)

If you added Supabase credentials:

1. Go to your Supabase dashboard → **SQL Editor** → New query
2. Paste the full contents of `supabase_schema.sql`
3. Click **Run**

This creates four tables: `users`, `analyses`, `hr_sessions`, `chat_messages`, with indexes and Row Level Security policies.

### 5. Start the backend

```bash
uvicorn api:app --reload --port 8000
```

### 6. Start the frontend

```bash
cd web
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:3000` and proxies all `/api/*` requests to port 8000 automatically.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Your Groq API key from [console.groq.com](https://console.groq.com) |
| `SECRET_KEY` | Yes | Long random string used to sign JWT tokens |
| `SUPABASE_URL` | No | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | No | Supabase service role key (bypasses RLS, backend-only) |
| `PYTHON_VERSION` | Render only | Set to `3.11.0` in Render dashboard |
| `PRODUCTION_DOMAIN` | Render only | Your deployed URL, e.g. `https://your-app.onrender.com` — added to CORS allow-list |

---

## Database Setup

The `supabase_schema.sql` file creates the full schema. Summary:

```sql
-- Stores registered users (email + bcrypt-hashed password)
users (id, created_at, email, password_hash, name)

-- One row per ATS analysis run
analyses (id, created_at, user_id, filename, mode, score,
          selected, strengths[], weaknesses[], total_skills)

-- Saved HR screening sessions (full results as JSONB)
hr_sessions (id, created_at, user_id, name, jd_text, results)

-- Chat message log (optional, for future use)
chat_messages (id, created_at, session_id, role, content)
```

All tables have Row Level Security enabled. The backend uses the service role key which bypasses RLS — policies protect against direct browser access.

---

## Deployment (Render.com)

The app is deployed as a single Render **Web Service** — the FastAPI backend builds the React frontend and serves it as static files. No separate frontend deployment needed.

### Step-by-step

1. **Fork / push** this repo to your GitHub account

2. Go to [render.com](https://render.com) → **New** → **Web Service** → connect your repo

3. Set these in the Render dashboard:

   | Setting | Value |
   |---------|-------|
   | **Environment** | Python |
   | **Build command** | `pip install -r requirements.txt && cd web && npm install && npm run build` |
   | **Start command** | `uvicorn api:app --host 0.0.0.0 --port $PORT` |

4. Add environment variables under **Environment** tab:

   | Variable | Value |
   |----------|-------|
   | `GROQ_API_KEY` | your Groq key |
   | `SECRET_KEY` | a long random string |
   | `SUPABASE_URL` | your Supabase project URL |
   | `SUPABASE_SERVICE_KEY` | your Supabase service role key |
   | `PYTHON_VERSION` | `3.11.0` |
   | `PRODUCTION_DOMAIN` | `https://your-app.onrender.com` *(add after first deploy)* |

5. Click **Deploy** — Render auto-deploys on every push to `main`

> **Note:** On Render's free tier the service spins down after inactivity. First request after spin-down takes ~30 seconds. Upgrade to the $7/mo plan to keep it always-on.

---

## API Reference

All endpoints are prefixed with `/api`. Requests that include a valid `Authorization: Bearer <token>` header are treated as authenticated.

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Create account. Returns JWT + user object. |
| `POST` | `/api/auth/login` | `username` + `password` (form) | Login. Returns JWT + user object. |
| `GET` | `/api/auth/me` | — | Returns current user. Requires auth. |

### AI — Candidate

| Method | Endpoint | Form Fields | Description |
|--------|----------|-------------|-------------|
| `POST` | `/api/analyze` | `resume` (file), `jd` (file, optional), `mode` (`ats`\|`jd`) | ATS score. Saves to history if authenticated. |
| `POST` | `/api/chat` | `resume` (file), `question` (str) | Answer a question about the resume. |
| `POST` | `/api/questions` | `resume` (file), `type` (str), `difficulty` (str), `count` (int) | Generate interview questions. |
| `POST` | `/api/improvements` | `resume` (file), `sections` (JSON array of strings) | Get improvement suggestions. |
| `POST` | `/api/generate` | `resume` (file), `job_role` (str), `jd` (file, optional) | Generate improved resume in markdown. |

### AI — HR

| Method | Endpoint | Form Fields | Description |
|--------|----------|-------------|-------------|
| `POST` | `/api/screen` | `resumes` (files, 2+), `jd_text` (str), `top_n` (int) | Bulk screen and rank candidates. Auto-saves session if authenticated. |

### PDF

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/pdf/resume` | `{ markdown: str }` | Returns improved resume as PDF. |
| `POST` | `/api/pdf/screening` | screening results object | Returns screening report as PDF. |

### History (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/history/analyses` | List past ATS analyses (last 30). |
| `GET` | `/api/history/hr-sessions` | List saved HR sessions (last 20). |
| `GET` | `/api/history/hr-sessions/{id}` | Get full data for a specific HR session. |
| `POST` | `/api/history/hr-sessions` | Manually save an HR session. |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Returns `{ status: "ok", db: true/false }` |

---

## How It Works

### ATS Scoring

1. Resume is parsed with pypdf (or read as plain text if `.txt`)
2. If mode is `jd`: the LLM extracts a list of required skills from the job description
3. If mode is `ats`: a default set of 10 common skills is used
4. The LLM is given the full skills list and the first 3000 chars of the resume and asked to return a JSON object `{ "Python": "YES", "SQL": "NO", ... }` for each skill
5. Score = `matched / total * 100`. Selected = score ≥ 75

### Chat (RAG-lite)

The resume text is stored in memory on the agent instance. The LLM is given the resume text (up to 4000 chars) + the user's question in a single prompt. No vector DB — the model uses its context window directly.

### Resume Generation

The LLM rewrites the original resume in markdown, optimized for the target role. The markdown is then rendered to a styled A4 PDF by ReportLab — H1 becomes the candidate name, H2 becomes section headers with indigo rule lines, bullets render as proper bullet points.

### Bulk Screening

Each resume is scored independently using the same skill-matching logic as ATS mode, all against the same JD-extracted skill list. Results are sorted descending by score. The PDF report includes a ranked table, color-coded scores, and a skills detail section for the top N candidates.

---

## License

MIT
