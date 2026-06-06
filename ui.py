import streamlit as st
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import io

def apply_styles():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { font-family: 'Inter', sans-serif; }

    .stApp {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
        color: #e0e0e0;
    }

    section[data-testid="stSidebar"] {
        background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
        border-right: 1px solid #2d2d5e;
    }

    .main-header {
        text-align: center;
        padding: 2rem 0 1rem 0;
    }

    .main-header h1 {
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.3rem;
    }

    .main-header p {
        color: #888;
        font-size: 1rem;
    }

    .card {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1rem 0;
        backdrop-filter: blur(10px);
    }

    .score-display {
        text-align: center;
        padding: 2rem;
        border-radius: 16px;
        margin: 1rem 0;
    }

    .score-number {
        font-size: 4rem;
        font-weight: 700;
        line-height: 1;
    }

    .score-selected {
        background: linear-gradient(135deg, rgba(102,216,102,0.1), rgba(102,216,102,0.05));
        border: 2px solid rgba(102,216,102,0.3);
    }

    .score-rejected {
        background: linear-gradient(135deg, rgba(255,100,100,0.1), rgba(255,100,100,0.05));
        border: 2px solid rgba(255,100,100,0.3);
    }

    .skill-tag {
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        margin: 0.2rem;
        font-size: 0.85rem;
        font-weight: 500;
    }

    .skill-strength {
        background: rgba(102,216,102,0.15);
        border: 1px solid rgba(102,216,102,0.4);
        color: #66d866;
    }

    .skill-weakness {
        background: rgba(255,100,100,0.15);
        border: 1px solid rgba(255,100,100,0.4);
        color: #ff6464;
    }

    .chat-message-user {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 18px 18px 4px 18px;
        padding: 0.8rem 1.2rem;
        margin: 0.5rem 0;
        margin-left: 20%;
        color: white;
    }

    .chat-message-bot {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 18px 18px 18px 4px;
        padding: 0.8rem 1.2rem;
        margin: 0.5rem 0;
        margin-right: 20%;
        color: #e0e0e0;
    }

    .stButton > button {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0.6rem 1.5rem;
        font-weight: 600;
        font-size: 0.95rem;
        width: 100%;
        transition: all 0.3s ease;
    }

    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }

    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea,
    .stSelectbox > div > div {
        background: rgba(255,255,255,0.05) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 10px !important;
        color: #e0e0e0 !important;
    }

    .stTabs [data-baseweb="tab-list"] {
        background: rgba(255,255,255,0.03);
        border-radius: 12px;
        padding: 0.3rem;
        gap: 0.2rem;
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        color: #888;
        font-weight: 500;
        padding: 0.5rem 1rem;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        color: white !important;
    }

    .section-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #a78bfa;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(167,139,250,0.2);
    }

    .stFileUploader {
        background: rgba(255,255,255,0.03);
        border: 2px dashed rgba(102,126,234,0.4);
        border-radius: 12px;
        padding: 1rem;
    }

    div[data-testid="stMarkdownContainer"] p { color: #ccc; }
    .stSelectbox label, .stMultiSelect label,
    .stTextArea label, .stTextInput label,
    .stSlider label, .stRadio label { color: #aaa !important; }
    </style>
    """, unsafe_allow_html=True)


def render_sidebar():
    with st.sidebar:
        st.markdown("### 🤖 Recruitment AI Agent")
        st.markdown("---")

        st.markdown("**📄 Upload Resume**")
        resume_file = st.file_uploader(
            "Upload Resume (PDF or TXT)",
            type=["pdf", "txt"],
            key="resume_upload",
            label_visibility="collapsed"
        )

        if resume_file:
            with st.spinner("Processing resume..."):
                agent = st.session_state.agent
                text = agent.extract_text_from(resume_file)
                st.session_state.resume_text = text
                agent.resume_text = text
                agent.create_rag_vector_store(text)
                st.success("✅ Resume loaded!")

        st.markdown("---")
        st.markdown("**📋 Upload Job Description (Optional)**")
        jd_file = st.file_uploader(
            "Upload JD (PDF or TXT)",
            type=["pdf", "txt"],
            key="jd_upload",
            label_visibility="collapsed"
        )

        if jd_file:
            with st.spinner("Processing JD..."):
                agent = st.session_state.agent
                text = agent.extract_text_from(jd_file)
                st.session_state.jd_text = text
                agent.jd_text = text
                st.success("✅ JD loaded!")

        st.markdown("---")

        if st.session_state.resume_text:
            st.markdown("**Status**")
            st.markdown("🟢 Resume: Ready")
            if st.session_state.jd_text:
                st.markdown("🟢 JD: Ready")
            else:
                st.markdown("🟡 JD: Not uploaded")
        else:
            st.markdown("⚪ No resume uploaded")

        st.markdown("---")
        st.markdown("<small style='color:#555'>Built with Gemini + LangChain + FAISS</small>",
                    unsafe_allow_html=True)


def render_analysis_tab():
    st.markdown('<div class="section-title">📊 Resume Analysis</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        mode = st.radio(
            "Analysis Mode",
            ["ATS Keywords", "Job Description"],
            horizontal=True
        )
    with col2:
        if mode == "Job Description" and not st.session_state.jd_text:
            st.warning("⚠️ Upload a JD in the sidebar first")

    if st.button("🔍 Analyze Resume", key="analyze_btn"):
        if not st.session_state.resume_text:
            st.error("Please upload a resume first!")
            return

        with st.spinner("Analyzing resume... this may take 30-60 seconds"):
            agent = st.session_state.agent
            analysis_mode = "jd" if mode == "Job Description" else "ats"
            result = agent.analyze_resume(
                st.session_state.resume_text,
                st.session_state.jd_text,
                mode=analysis_mode
            )
            st.session_state.analysis_result = result

    if st.session_state.analysis_result:
        result = st.session_state.analysis_result
        score = result["score"]
        selected = result["selected"]

        col1, col2 = st.columns([1, 2])

        with col1:
            status_class = "score-selected" if selected else "score-rejected"
            status_text = "✅ SELECTED" if selected else "❌ NOT SELECTED"
            score_color = "#66d866" if selected else "#ff6464"
            st.markdown(f"""
            <div class="score-display {status_class}">
                <div class="score-number" style="color:{score_color}">{score}</div>
                <div style="color:#aaa;margin-top:0.3rem">out of 100</div>
                <div style="margin-top:1rem;font-weight:600;font-size:1.1rem">{status_text}</div>
                <div style="color:#888;font-size:0.85rem;margin-top:0.3rem">Cutoff: 75</div>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            fig, ax = plt.subplots(figsize=(5, 5), facecolor='none')
            sizes = [len(result["strengths"]), max(len(result["weaknesses"]), 0.1)]
            colors = ['#66d866', '#ff6464']
            wedges, texts, autotexts = ax.pie(
                sizes,
                labels=['Strengths', 'Weaknesses'],
                colors=colors,
                autopct='%1.0f%%',
                startangle=90,
                textprops={'color': 'white', 'fontsize': 12}
            )
            ax.set_facecolor('none')
            fig.patch.set_alpha(0)
            st.pyplot(fig)
            plt.close()

        st.markdown("---")
        col1, col2 = st.columns(2)

        with col1:
            st.markdown("**✅ Strengths**")
            if result["strengths"]:
                tags = " ".join([f'<span class="skill-tag skill-strength">{s}</span>'
                                 for s in result["strengths"]])
                st.markdown(tags, unsafe_allow_html=True)
            else:
                st.markdown("*No matching skills found*")

        with col2:
            st.markdown("**❌ Missing Skills**")
            if result["weaknesses"]:
                tags = " ".join([f'<span class="skill-tag skill-weakness">{s}</span>'
                                 for s in result["weaknesses"]])
                st.markdown(tags, unsafe_allow_html=True)
            else:
                st.markdown("*All skills matched!*")

        st.markdown("---")
        report = f"""# Resume Analysis Report
Score: {score}/100
Status: {"SELECTED" if selected else "NOT SELECTED"}
Strengths: {", ".join(result["strengths"])}
Missing Skills: {", ".join(result["weaknesses"])}
        """
        st.download_button(
            "📥 Download Report",
            report,
            file_name="analysis_report.txt",
            mime="text/plain"
        )


def render_chat_tab():
    st.markdown('<div class="section-title">💬 Chat with Resume</div>', unsafe_allow_html=True)

    if not st.session_state.resume_text:
        st.info("👈 Upload a resume in the sidebar to start chatting")
        return

    for msg in st.session_state.chat_history:
        if msg["role"] == "user":
            st.markdown(f'<div class="chat-message-user">{msg["content"]}</div>',
                        unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="chat-message-bot">{msg["content"]}</div>',
                        unsafe_allow_html=True)

    question = st.text_input(
        "Ask anything about the resume...",
        placeholder="e.g. What are the candidate's top skills?",
        key="chat_input"
    )

    if st.button("Send 💬", key="send_btn"):
        if question:
            st.session_state.chat_history.append({"role": "user", "content": question})
            with st.spinner("Thinking..."):
                answer = st.session_state.agent.ask_question(question)
            st.session_state.chat_history.append({"role": "bot", "content": answer})
            st.rerun()

    if st.session_state.chat_history:
        if st.button("🗑️ Clear Chat", key="clear_chat"):
            st.session_state.chat_history = []
            st.rerun()


def render_questions_tab():
    st.markdown('<div class="section-title">❓ Interview Question Generator</div>',
                unsafe_allow_html=True)

    if not st.session_state.resume_text:
        st.info("👈 Upload a resume in the sidebar first")
        return

    col1, col2, col3 = st.columns(3)

    with col1:
        q_type = st.selectbox(
            "Question Type",
            ["Technical", "Behavioral", "Coding", "Scenario-based",
             "Experience-based", "Project-based"]
        )

    with col2:
        difficulty = st.selectbox(
            "Difficulty",
            ["Easy", "Medium", "Hard"]
        )

    with col3:
        count = st.slider("Number of Questions", 3, 15, 5)

    if st.button("⚡ Generate Questions", key="gen_questions"):
        with st.spinner("Generating personalized questions..."):
            questions = st.session_state.agent.generate_interview_questions(
                q_type, difficulty, count
            )
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(questions)
        st.markdown('</div>', unsafe_allow_html=True)

        st.download_button(
            "📥 Download Questions",
            questions,
            file_name="interview_questions.txt",
            mime="text/plain"
        )


def render_improvements_tab():
    st.markdown('<div class="section-title">💡 Resume Improvement Suggestions</div>',
                unsafe_allow_html=True)

    if not st.session_state.resume_text:
        st.info("👈 Upload a resume in the sidebar first")
        return

    sections = st.multiselect(
        "Select sections to improve",
        ["Skills", "Projects", "Experience", "Achievements", "Overall Structure"],
        default=["Skills", "Overall Structure"]
    )

    if st.button("💡 Get Suggestions", key="suggest_btn"):
        if not sections:
            st.warning("Please select at least one section")
            return
        with st.spinner("Analyzing and generating suggestions..."):
            suggestions = st.session_state.agent.suggest_improvements(sections)
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(suggestions)
        st.markdown('</div>', unsafe_allow_html=True)


def render_generate_tab():
    st.markdown('<div class="section-title">✨ Generate Improved Resume</div>',
                unsafe_allow_html=True)

    if not st.session_state.resume_text:
        st.info("👈 Upload a resume in the sidebar first")
        return

    col1, col2 = st.columns(2)

    with col1:
        job_role = st.text_input(
            "Target Job Role",
            placeholder="e.g. AI Engineer, Data Scientist, Backend Developer"
        )

    with col2:
        use_jd = st.checkbox("Tailor to uploaded JD", value=bool(st.session_state.jd_text))

    if st.button("✨ Generate Resume", key="gen_resume"):
        if not job_role:
            st.warning("Please enter a job role")
            return
        with st.spinner("Generating your improved resume..."):
            jd = st.session_state.jd_text if use_jd else None
            improved = st.session_state.agent.generate_improved_resume(job_role, jd)

        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown(improved)
        st.markdown('</div>', unsafe_allow_html=True)

        st.download_button(
            "📥 Download Resume (Markdown)",
            improved,
            file_name="improved_resume.md",
            mime="text/markdown"
        )


def render_ui():
    apply_styles()

    st.markdown("""
    <div class="main-header">
        <h1>🤖 Recruitment AI Agent</h1>
        <p>AI-Powered Resume Analysis & Interview Preparation System</p>
    </div>
    """, unsafe_allow_html=True)

    render_sidebar()

    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊 Analysis",
        "💬 Chat",
        "❓ Questions",
        "💡 Improvements",
        "✨ Generate Resume"
    ])

    with tab1:
        render_analysis_tab()
    with tab2:
        render_chat_tab()
    with tab3:
        render_questions_tab()
    with tab4:
        render_improvements_tab()
    with tab5:
        render_generate_tab()