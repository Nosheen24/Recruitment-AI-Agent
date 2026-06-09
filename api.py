"""
FastAPI backend — Recruitment AI
Dev:  uvicorn api:app --reload --port 8000
Prod: uvicorn api:app --host 0.0.0.0 --port $PORT
"""

import json
import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import (
    APIRouter, Depends, FastAPI, File, Form, Header,
    HTTPException, UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from jose import JWTError, jwt
import bcrypt as _bcrypt

from agent import ResumeAnalysisAgent
import database as db
from pdf_utils import generate_resume_pdf, generate_screening_report_pdf

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Recruitment AI API", version="2.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
_prod = os.getenv("PRODUCTION_DOMAIN")
if _prod:
    _origins.append(_prod)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth config ───────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-use-a-long-random-string")
ALGORITHM  = "HS256"
TOKEN_DAYS = 7


def _hash(pw: str) -> str:
    return _bcrypt.hashpw(pw.encode(), _bcrypt.gensalt()).decode()


def _verify(pw: str, hashed: str) -> bool:
    return _bcrypt.checkpw(pw.encode(), hashed.encode())


def _create_token(user_id: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(days=TOKEN_DAYS)
    return jwt.encode({"sub": user_id, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)


def _decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, detail="Not authenticated")
    uid = _decode_token(authorization[7:])
    if not uid:
        raise HTTPException(401, detail="Invalid or expired token")
    user = db.get_user_by_id(uid)
    if not user:
        raise HTTPException(401, detail="User not found")
    return user


async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    return _decode_token(authorization[7:])


# ── Helpers ───────────────────────────────────────────────────────────────────

class _FileAdapter:
    def __init__(self, content_type: str, data: bytes, filename: str):
        self.type = content_type or ("application/pdf" if filename.endswith(".pdf") else "text/plain")
        self._data = data

    def read(self):
        return self._data


async def _read_file(f: UploadFile) -> _FileAdapter:
    data = await f.read()
    return _FileAdapter(f.content_type or "", data, f.filename or "")


def _pdf_response(data: bytes, filename: str) -> Response:
    return Response(
        content=data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ── Router (all routes live under /api) ───────────────────────────────────────
router = APIRouter(prefix="/api")


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str


@router.post("/auth/register")
async def register(body: RegisterRequest):
    if not db.is_available():
        raise HTTPException(503, detail="Database not configured. Add SUPABASE_URL and SUPABASE_SERVICE_KEY to your .env file.")
    if len(body.password) < 6:
        raise HTTPException(400, detail="Password must be at least 6 characters.")
    existing = db.get_user_by_email(body.email)
    if existing:
        raise HTTPException(400, detail="An account with this email already exists.")
    user = db.create_user(body.email, _hash(body.password), body.name.strip())
    if not user:
        raise HTTPException(500, detail="Could not create account. Please try again.")
    token = _create_token(user["id"])
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"]},
    }


@router.post("/auth/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    if not db.is_available():
        raise HTTPException(503, detail="Database not configured.")
    user = db.get_user_by_email(form.username)
    if not user or not _verify(form.password, user["password_hash"]):
        raise HTTPException(401, detail="Incorrect email or password.")
    token = _create_token(user["id"])
    return {
        "access_token": token,
        "token_type":   "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"]},
    }


@router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


# ── History ───────────────────────────────────────────────────────────────────

@router.get("/history/analyses")
async def history_analyses(current_user: dict = Depends(get_current_user)):
    return db.get_user_analyses(current_user["id"])


@router.get("/history/hr-sessions")
async def history_hr_sessions(current_user: dict = Depends(get_current_user)):
    return db.get_user_hr_sessions(current_user["id"])


@router.get("/history/hr-sessions/{session_id}")
async def get_hr_session(session_id: str, current_user: dict = Depends(get_current_user)):
    session = db.get_hr_session(session_id, current_user["id"])
    if not session:
        raise HTTPException(404, detail="Session not found.")
    return session


@router.post("/history/hr-sessions")
async def save_hr_session(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    results  = body.get("results", {})
    jd_text  = body.get("jd_text", "")
    total    = results.get("total", 0)
    name     = body.get("name") or f"{total} candidates — {datetime.now().strftime('%b %d, %Y')}"
    saved    = db.save_hr_session(current_user["id"], name, jd_text, results)
    if not saved:
        raise HTTPException(500, detail="Could not save session.")
    return saved


# ── PDF ───────────────────────────────────────────────────────────────────────

class ResumePDFRequest(BaseModel):
    markdown: str


@router.post("/pdf/resume")
async def resume_pdf(body: ResumePDFRequest):
    pdf = generate_resume_pdf(body.markdown)
    return _pdf_response(pdf, "improved_resume.pdf")


@router.post("/pdf/screening")
async def screening_pdf(body: dict):
    pdf = generate_screening_report_pdf(body)
    return _pdf_response(pdf, "candidate_screening_report.pdf")


# ── Core AI ───────────────────────────────────────────────────────────────────

@router.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd:     UploadFile = File(None),
    mode:   str        = Form("ats"),
    user_id: Optional[str] = Depends(get_optional_user),
):
    agent = ResumeAnalysisAgent()
    resume_text = agent.extract_text_from(await _read_file(resume))
    agent.resume_text = resume_text
    agent.create_rag_vector_store(resume_text)

    jd_text = None
    if jd and jd.filename:
        jd_text = agent.extract_text_from(await _read_file(jd))

    result = agent.analyze_resume(resume_text, jd_text, mode=mode)
    agent.cleanup()

    db.save_analysis(
        score=result["score"],
        selected=result["selected"],
        strengths=result["strengths"],
        weaknesses=result["weaknesses"],
        total_skills=result["total_skills"],
        filename=resume.filename,
        mode=mode,
        user_id=user_id,
    )

    return result


@router.post("/chat")
async def chat(
    resume:   UploadFile = File(...),
    question: str        = Form(...),
):
    agent = ResumeAnalysisAgent()
    text  = agent.extract_text_from(await _read_file(resume))
    agent.resume_text = text
    agent.create_rag_vector_store(text)
    answer = agent.ask_question(question)
    agent.cleanup()
    return {"answer": answer}


@router.post("/questions")
async def questions(
    resume:     UploadFile = File(...),
    type:       str        = Form("Technical"),
    difficulty: str        = Form("Medium"),
    count:      str        = Form("5"),
):
    agent = ResumeAnalysisAgent()
    agent.resume_text = agent.extract_text_from(await _read_file(resume))
    result = agent.generate_interview_questions(type, difficulty, int(count))
    agent.cleanup()
    return {"questions": result}


@router.post("/improvements")
async def improvements(
    resume:   UploadFile = File(...),
    sections: str        = Form('["Skills","Overall Structure"]'),
):
    agent = ResumeAnalysisAgent()
    agent.resume_text = agent.extract_text_from(await _read_file(resume))
    result = agent.suggest_improvements(json.loads(sections))
    agent.cleanup()
    return {"suggestions": result}


@router.post("/generate")
async def generate(
    resume:   UploadFile = File(...),
    job_role: str        = Form(...),
    jd:       UploadFile = File(None),
):
    agent = ResumeAnalysisAgent()
    agent.resume_text = agent.extract_text_from(await _read_file(resume))
    jd_text = None
    if jd and jd.filename:
        jd_text = agent.extract_text_from(await _read_file(jd))
    result = agent.generate_improved_resume(job_role, jd_text)
    agent.cleanup()
    return {"improved_resume": result}


@router.post("/screen")
async def screen(
    resumes: List[UploadFile] = File(...),
    jd_text: str              = Form(...),
    top_n:   int              = Form(5),
    user_id: Optional[str]   = Depends(get_optional_user),
):
    if len(resumes) < 2:
        raise HTTPException(400, detail="Upload at least 2 resumes to screen.")

    agent      = ResumeAnalysisAgent()
    skills     = agent.extract_skills_from_jd(jd_text)
    total_s    = len(skills)
    candidates = []

    for rf in resumes:
        adapter    = await _read_file(rf)
        text       = agent.extract_text_from(adapter)
        str_s, wk  = agent.analyze_all_skills_at_once(skills, text)
        score      = int((len(str_s) / total_s) * 100) if total_s > 0 else 0
        candidates.append({
            "filename":  rf.filename or f"Resume {len(candidates)+1}",
            "score":     score,
            "selected":  score >= agent.cutoff_score,
            "strengths": str_s,
            "weaknesses": wk,
        })

    agent.cleanup()
    candidates.sort(key=lambda x: x["score"], reverse=True)
    results = {
        "results":          candidates,
        "top_n":            min(int(top_n), len(candidates)),
        "total":            len(candidates),
        "skills_analyzed":  skills,
    }

    if user_id:
        name = f"{len(candidates)} candidates — {datetime.now().strftime('%b %d, %Y')}"
        db.save_hr_session(user_id, name, jd_text, results)

    return results


@router.get("/health")
def health():
    return {"status": "ok", "db": db.is_available()}


# ── Register router ───────────────────────────────────────────────────────────
app.include_router(router)

# ── Serve built frontend (production) ─────────────────────────────────────────
# Must come AFTER all API routes so /api/* is handled first.
if os.path.exists("web/dist"):
    app.mount("/", StaticFiles(directory="web/dist", html=True), name="static")
