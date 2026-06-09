"""
Supabase integration — optional.
The app works without it; auth and history simply won't persist.
Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env to enable.
"""

import os
from typing import Optional

try:
    from supabase import create_client
    _SUPABASE_AVAILABLE = True
except ImportError:
    _SUPABASE_AVAILABLE = False

_client = None


def _get_client():
    global _client
    if _client:
        return _client
    if not _SUPABASE_AVAILABLE:
        return None
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return None
    _client = create_client(url, key)
    return _client


def is_available() -> bool:
    return _get_client() is not None


# ── Users ─────────────────────────────────────────────────────────────────────

def create_user(email: str, hashed_password: str, name: str) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        result = sb.table("users").insert({
            "email": email.lower().strip(),
            "password_hash": hashed_password,
            "name": name,
        }).execute()
        return result.data[0] if result.data else None
    except Exception:
        return None


def get_user_by_email(email: str) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        result = sb.table("users").select("*").eq("email", email.lower().strip()).execute()
        return result.data[0] if result.data else None
    except Exception:
        return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        result = (
            sb.table("users")
            .select("id,email,name,created_at")
            .eq("id", user_id)
            .execute()
        )
        return result.data[0] if result.data else None
    except Exception:
        return None


# ── Analyses ──────────────────────────────────────────────────────────────────

def save_analysis(
    score: int,
    selected: bool,
    strengths: list,
    weaknesses: list,
    total_skills: int,
    filename: Optional[str] = None,
    mode: str = "ats",
    user_id: Optional[str] = None,
) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        payload = {
            "score": score,
            "selected": selected,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "total_skills": total_skills,
            "filename": filename,
            "mode": mode,
        }
        if user_id:
            payload["user_id"] = user_id
        result = sb.table("analyses").insert(payload).execute()
        return result.data[0] if result.data else None
    except Exception:
        return None


def get_user_analyses(user_id: str, limit: int = 30) -> list:
    sb = _get_client()
    if not sb:
        return []
    try:
        result = (
            sb.table("analyses")
            .select("id,created_at,filename,mode,score,selected,strengths,weaknesses,total_skills")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception:
        return []


# ── HR Sessions ───────────────────────────────────────────────────────────────

def save_hr_session(
    user_id: str,
    name: str,
    jd_text: str,
    results: dict,
) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        result = sb.table("hr_sessions").insert({
            "user_id": user_id,
            "name": name,
            "jd_text": jd_text,
            "results": results,
        }).execute()
        return result.data[0] if result.data else None
    except Exception:
        return None


def get_user_hr_sessions(user_id: str, limit: int = 20) -> list:
    sb = _get_client()
    if not sb:
        return []
    try:
        result = (
            sb.table("hr_sessions")
            .select("id,created_at,name,results")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception:
        return []


def get_hr_session(session_id: str, user_id: str) -> Optional[dict]:
    sb = _get_client()
    if not sb:
        return None
    try:
        result = (
            sb.table("hr_sessions")
            .select("*")
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )
        return result.data[0] if result.data else None
    except Exception:
        return None


# ── Chat Messages ─────────────────────────────────────────────────────────────

def save_chat_message(session_id: str, role: str, content: str) -> None:
    sb = _get_client()
    if not sb:
        return
    try:
        sb.table("chat_messages").insert({
            "session_id": session_id,
            "role": role,
            "content": content,
        }).execute()
    except Exception:
        pass
