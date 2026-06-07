A full AI-powered Recruitment Agent with:

Resume Analysis with ATS scoring and pie charts
Chat with Resume using RAG
Interview Question Generator
Resume Improvement Suggestions
AI Resume Generator tailored to any job role

Tech stack: Python, Streamlit, LangChain, Groq (LLaMA 3.3), FAISS, HuggingFace

Recruitment AI Agent is a full-stack AI-powered web application that automates the resume screening and interview preparation process. Built with Python, Streamlit, LangChain, and Groq's LLaMA 3.3 70B model, it enables recruiters and candidates to upload a resume and instantly receive an ATS compatibility score, a breakdown of matched and missing skills against either standard keywords or a custom job description, and a downloadable PDF analysis report. Beyond scoring, the platform offers five integrated AI features: a RAG-based chat interface that lets users ask natural language questions directly about the resume content, an interview question generator that produces role-specific questions across multiple difficulty levels and question types, a resume improvement suggester that provides before-and-after examples for selected sections, and an AI resume rewriter that generates a fully optimized, ATS-ready resume tailored to any target job role. The application uses FAISS as a local vector store for semantic document retrieval, HuggingFace sentence embeddings for text chunking, and ReportLab for professional PDF report generation — all wrapped in a polished, responsive dark-themed UI with no paid API costs beyond the free Groq tier.
