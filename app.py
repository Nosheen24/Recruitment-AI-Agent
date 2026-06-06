import streamlit as st
from agent import ResumeAnalysisAgent
from ui import render_ui

def init_session():
    if "agent" not in st.session_state:
        st.session_state.agent = ResumeAnalysisAgent()
    if "resume_text" not in st.session_state:
        st.session_state.resume_text = None
    if "jd_text" not in st.session_state:
        st.session_state.jd_text = None
    if "analysis_result" not in st.session_state:
        st.session_state.analysis_result = None
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

def main():
    st.set_page_config(
        page_title="Recruitment AI Agent",
        page_icon="🤖",
        layout="wide",
        initial_sidebar_state="expanded"
    )

    init_session()
    render_ui()

if __name__ == "__main__":
    main()