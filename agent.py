import os
import json
import re
import tempfile
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

class ResumeAnalysisAgent:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.cutoff_score = 75
        self.vector_store = None
        self.resume_text = None
        self.jd_text = None
        self.temp_files = []

        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            groq_api_key=self.groq_api_key,
            temperature=0.3
        )

        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2"
        )

    def extract_text_from_pdf(self, pdf_path):
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def extract_text_from(self, uploaded_file):
        suffix = ".pdf" if uploaded_file.type == "application/pdf" else ".txt"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(uploaded_file.read())
            tmp_path = tmp.name
            self.temp_files.append(tmp_path)
        if suffix == ".pdf":
            return self.extract_text_from_pdf(tmp_path)
        else:
            with open(tmp_path, "r", encoding="utf-8") as f:
                return f.read()

    def create_rag_vector_store(self, text):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        chunks = splitter.split_text(text)
        self.vector_store = FAISS.from_texts(chunks, self.embeddings)
        return self.vector_store

    def extract_skills_from_jd(self, jd_text):
        prompt = f"""Extract all required technical skills, tools, and technologies from this job description.
Return ONLY a comma-separated list of skills, nothing else.
Job Description:
{jd_text}"""
        response = self.llm.invoke(prompt)
        skills = [s.strip() for s in response.content.strip().split(",") if s.strip()]
        return skills

    def analyze_all_skills_at_once(self, skills, resume_text):
        skills_list = "\n".join([f"- {s}" for s in skills])
        prompt = f"""Analyze this resume and for each skill below, answer YES or NO.
Return ONLY a JSON object like: {{"Python": "YES", "SQL": "NO"}}

Skills:
{skills_list}

Resume:
{resume_text[:3000]}

Return ONLY the JSON:"""
        response = self.llm.invoke(prompt)
        content = response.content.strip()
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group())
                strengths = [s for s, v in result.items() if "YES" in str(v).upper()]
                weaknesses = [s for s, v in result.items() if "NO" in str(v).upper()]
                return strengths, weaknesses
            except:
                pass
        return [], skills.copy()

    def analyze_resume(self, resume_text, jd_text=None, mode="ats"):
        self.resume_text = resume_text
        self.jd_text = jd_text

        if mode == "jd" and jd_text:
            skills = self.extract_skills_from_jd(jd_text)
        else:
            skills = [
                "Python", "Machine Learning", "Data Analysis", "SQL",
                "Communication", "Problem Solving", "Teamwork",
                "Project Management", "Leadership", "Excel"
            ]

        strengths, weaknesses = self.analyze_all_skills_at_once(skills, resume_text)
        total = len(skills)
        score = int((len(strengths) / total) * 100) if total > 0 else 0
        selected = score >= self.cutoff_score

        return {
            "score": score,
            "selected": selected,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "total_skills": total
        }

    def ask_question(self, question):
        if not self.vector_store:
            return "Please upload a resume first."

        docs = self.vector_store.similarity_search(question, k=3)
        context = "\n".join([d.page_content for d in docs])

        prompt = f"""Use the resume context below to answer the question accurately.
If the answer is not in the resume, say "This information is not in the resume."

Context: {context}
Question: {question}
Answer:"""
        response = self.llm.invoke(prompt)
        return response.content

    def generate_interview_questions(self, question_type, difficulty, count):
        if not self.resume_text:
            return "Please upload a resume first."

        prompt = f"""Based on this resume, generate {count} {difficulty} level {question_type} interview questions.
Make questions specific to the candidate's actual experience and skills.
Number each question.

Resume:
{self.resume_text[:3000]}

Generate exactly {count} questions:"""
        response = self.llm.invoke(prompt)
        return response.content

    def suggest_improvements(self, sections):
        if not self.resume_text:
            return "Please upload a resume first."

        sections_str = ", ".join(sections)
        prompt = f"""Analyze this resume and suggest specific improvements for: {sections_str}

For each section provide:
- ISSUE: What is wrong or weak
- BEFORE: Example of current weak content
- AFTER: Example of improved content

Resume:
{self.resume_text[:3000]}"""
        response = self.llm.invoke(prompt)
        return response.content

    def generate_improved_resume(self, job_role, jd_text=None):
        if not self.resume_text:
            return "Please upload a resume first."

        jd_section = f"\nJob Description:\n{jd_text[:1500]}" if jd_text else ""
        prompt = f"""Rewrite and improve this resume for a {job_role} position.
Make it ATS-optimized, professional, and tailored to the role.
Use markdown formatting with clear sections.
{jd_section}

Original Resume:
{self.resume_text[:3000]}

Generate the improved resume in markdown:"""
        response = self.llm.invoke(prompt)
        return response.content

    def cleanup(self):
        for path in self.temp_files:
            try:
                os.unlink(path)
            except:
                pass
        self.temp_files = []