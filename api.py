"""
FastAPI backend — wraps ResumeAnalysisAgent for the React frontend.
Run:  uvicorn api:app --reload --port 8000
"""

import io
import json
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from agent import ResumeAnalysisAgent

app = FastAPI(title="Recruitment AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# one shared agent instance (stateful: holds vector store + texts)
_agent = ResumeAnalysisAgent()


class _FileAdapter:
    """Wraps FastAPI UploadFile bytes to match the Streamlit UploadedFile interface."""
    def __init__(self, content_type: str, data: bytes, filename: str):
        self.type = content_type or ("application/pdf" if filename.endswith(".pdf") else "text/plain")
        self._data = data

    def read(self):
        return self._data


# ── helpers ──────────────────────────────────────────────────────

async def _read_file(f: UploadFile) -> _FileAdapter:
    data = await f.read()
    return _FileAdapter(f.content_type or "", data, f.filename or "")


# ── routes ───────────────────────────────────────────────────────

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd:     UploadFile = File(None),
    mode:   str        = Form("ats"),
):
    resume_text = _agent.extract_text_from(await _read_file(resume))
    _agent.resume_text = resume_text
    _agent.create_rag_vector_store(resume_text)

    jd_text = None
    if jd and jd.filename:
        jd_text = _agent.extract_text_from(await _read_file(jd))
        _agent.jd_text = jd_text

    return _agent.analyze_resume(resume_text, jd_text, mode=mode)


@app.post("/chat")
async def chat(
    resume:   UploadFile = File(...),
    question: str        = Form(...),
):
    # re-index if the agent's vector store is stale or empty
    if not _agent.vector_store:
        text = _agent.extract_text_from(await _read_file(resume))
        _agent.resume_text = text
        _agent.create_rag_vector_store(text)
    return {"answer": _agent.ask_question(question)}


@app.post("/questions")
async def questions(
    resume:     UploadFile = File(...),
    type:       str        = Form("Technical"),
    difficulty: str        = Form("Medium"),
    count:      str        = Form("5"),
):
    if not _agent.resume_text:
        _agent.resume_text = _agent.extract_text_from(await _read_file(resume))
    return {"questions": _agent.generate_interview_questions(type, difficulty, int(count))}


@app.post("/improvements")
async def improvements(
    resume:   UploadFile = File(...),
    sections: str        = Form('["Skills","Overall Structure"]'),
):
    if not _agent.resume_text:
        _agent.resume_text = _agent.extract_text_from(await _read_file(resume))
    return {"suggestions": _agent.suggest_improvements(json.loads(sections))}


@app.post("/generate")
async def generate(
    resume:   UploadFile = File(...),
    job_role: str        = Form(...),
    jd:       UploadFile = File(None),
):
    if not _agent.resume_text:
        _agent.resume_text = _agent.extract_text_from(await _read_file(resume))
    jd_text = None
    if jd and jd.filename:
        jd_text = _agent.extract_text_from(await _read_file(jd))
    return {"improved_resume": _agent.generate_improved_resume(job_role, jd_text)}


@app.get("/health")
def health():
    return {"status": "ok"}
