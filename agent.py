import os
import tempfile
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()

class ResumeAnalysisAgent:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.cutoff_score = 75
        self.vector_store = None
        self.resume_text = None
        self.jd_text = None
        self.temp_files = []

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-lite",
            google_api_key=self.api_key,
            temperature=0.3
        )

        # Local embeddings - no API needed, no version issues
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
        prompt = f"""
        Extract all required technical skills, tools, and technologies from this job description.
        Return ONLY a comma-separated list of skills, nothing else.
        
        Job Description:
        {jd_text}
        """
        response = self.llm.invoke(prompt)
        skills_text = response.content.strip()
        skills = [s.strip() for s in skills_text.split(",") if s.strip()]
        return skills

    def analyze_skill_semantically(self, skill, resume_text):
        prompt = f"""
        Does this resume demonstrate knowledge or experience with "{skill}"?
        Look for direct mentions, related tools, or implied experience.
        
        Resume:
        {resume_text[:2000]}
        
        Answer with ONLY: YES or NO
        """
        response = self.llm.invoke(prompt)
        answer = response.content.strip().upper()
        return "YES" in answer

    def semantic_skill_analysis(self, skills, resume_text):
        strengths = []
        weaknesses = []

        def check_skill(skill):
            found = self.analyze_skill_semantically(skill, resume_text)
            return skill, found

        with ThreadPoolExecutor(max_workers=5) as executor:
            results = list(executor.map(check_skill, skills))

        for skill, found in results:
            if found:
                strengths.append(skill)
            else:
                weaknesses.append(skill)

        return strengths, weaknesses

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

        strengths, weaknesses = self.semantic_skill_analysis(skills, resume_text)

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

        retriever = self.vector_store.as_retriever(search_kwargs={"k": 3})

        prompt_template = """
        Use the resume context below to answer the question accurately.
        If the answer is not in the resume, say "This information is not in the resume."
        
        Context: {context}
        Question: {question}
        Answer:
        """

        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=retriever,
            chain_type_kwargs={"prompt": prompt}
        )

        result = chain.invoke({"query": question})
        return result["result"]

    def generate_interview_questions(self, question_type, difficulty, count):
        if not self.resume_text:
            return "Please upload a resume first."

        prompt = f"""
        Based on this resume, generate {count} {difficulty} level {question_type} interview questions.
        Make questions specific to the candidate's actual experience and skills.
        Number each question.
        
        Resume:
        {self.resume_text[:3000]}
        
        Generate exactly {count} questions:
        """

        response = self.llm.invoke(prompt)
        return response.content

    def suggest_improvements(self, sections):
        if not self.resume_text:
            return "Please upload a resume first."

        sections_str = ", ".join(sections)

        prompt = f"""
        Analyze this resume and suggest specific improvements for these sections: {sections_str}
        
        For each section, provide:
        - ISSUE: What is wrong or weak
        - BEFORE: Example of current weak content
        - AFTER: Example of improved content
        
        Be specific and actionable.
        
        Resume:
        {self.resume_text[:3000]}
        """

        response = self.llm.invoke(prompt)
        return response.content

    def generate_improved_resume(self, job_role, jd_text=None):
        if not self.resume_text:
            return "Please upload a resume first."

        jd_section = f"\nJob Description:\n{jd_text[:1500]}" if jd_text else ""

        prompt = f"""
        Rewrite and improve this resume for a {job_role} position.
        Make it ATS-optimized, professional, and tailored to the role.
        Use markdown formatting with clear sections.
        Enhance descriptions with strong action verbs and quantifiable results.
        {jd_section}
        
        Original Resume:
        {self.resume_text[:3000]}
        
        Generate the improved resume in markdown format:
        """

        response = self.llm.invoke(prompt)
        return response.content

    def cleanup(self):
        for path in self.temp_files:
            try:
                os.unlink(path)
            except:
                pass
        self.temp_files = []