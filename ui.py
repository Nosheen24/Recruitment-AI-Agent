import streamlit as st
import matplotlib.pyplot as plt

try:
    from report_generator import generate_pdf_report
    PDF_AVAILABLE = True
except Exception:
    PDF_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────
#  STYLES
# ─────────────────────────────────────────────────────────────────
def apply_styles():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

    /* ═══════════════════════════════════
       TOKENS
    ═══════════════════════════════════ */
    :root {
        --bg:           #f4f6f9;
        --surface:      #ffffff;
        --surface-2:    #f8fafc;
        --border:       #e2e8f0;
        --border-2:     #cbd5e1;

        --sidebar:      #111827;
        --sidebar-card: #1f2937;
        --sidebar-bd:   #374151;

        --indigo:       #4f46e5;
        --indigo-dark:  #3730a3;
        --indigo-light: #eef2ff;
        --indigo-glow:  rgba(79,70,229,.20);

        --emerald:      #10b981;
        --emerald-dark: #059669;
        --emerald-bg:   #ecfdf5;
        --emerald-bd:   #a7f3d0;

        --red:          #ef4444;
        --red-dark:     #dc2626;
        --red-bg:       #fef2f2;
        --red-bd:       #fecaca;

        --amber:        #f59e0b;
        --amber-bg:     #fffbeb;

        --t1:  #0f172a;
        --t2:  #475569;
        --t3:  #94a3b8;
        --inv: #ffffff;

        --sh1: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
        --sh2: 0 4px 12px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04);
        --sh3: 0 8px 28px rgba(0,0,0,.10), 0 4px 10px rgba(0,0,0,.05);
        --sh-indigo: 0 4px 18px rgba(79,70,229,.28);
        --sh-emerald: 0 4px 18px rgba(16,185,129,.22);

        --r1: 8px;   --r2: 12px;   --r3: 16px;   --r4: 20px;
    }

    *, *::before, *::after { box-sizing: border-box; }

    /* ═══════════════════════════════════
       STRIP STREAMLIT CHROME
    ═══════════════════════════════════ */
    header[data-testid="stHeader"]          { display: none !important; }
    [data-testid="stDecoration"]            { display: none !important; }
    #MainMenu                               { display: none !important; }
    .stDeployButton                         { display: none !important; }
    footer                                  { display: none !important; }
    [data-testid="stToolbar"]               { display: none !important; }

    /* ═══════════════════════════════════
       BASE
    ═══════════════════════════════════ */
    html, body,
    [data-testid="stAppViewContainer"],
    [data-testid="stMain"], .main {
        font-family: 'Inter', system-ui, sans-serif !important;
        background: var(--bg) !important;
        color: var(--t1) !important;
    }
    .main .block-container {
        padding: 2rem 2.25rem 4rem !important;
        max-width: 1100px !important;
    }

    /* reset Streamlit's global text-color bleed */
    .main p, .main li, .main span, .main div,
    div[data-testid="stMarkdownContainer"] p,
    div[data-testid="stMarkdownContainer"] li,
    div[data-testid="stMarkdownContainer"] span,
    div[data-testid="stMarkdownContainer"] div { color: var(--t2) !important; }
    .main h1,.main h2,.main h3,.main h4,
    .main strong,.main b                       { color: var(--t1) !important; }

    /* ═══════════════════════════════════
       SIDEBAR
    ═══════════════════════════════════ */
    section[data-testid="stSidebar"] {
        background: var(--sidebar) !important;
        border-right: 1px solid #1f2937 !important;
    }
    section[data-testid="stSidebar"] * { font-family: 'Inter', system-ui, sans-serif !important; }
    section[data-testid="stSidebar"] p,
    section[data-testid="stSidebar"] span,
    section[data-testid="stSidebar"] div,
    section[data-testid="stSidebar"] li   { color: #94a3b8 !important; }
    section[data-testid="stSidebar"] h1,
    section[data-testid="stSidebar"] h2,
    section[data-testid="stSidebar"] h3,
    section[data-testid="stSidebar"] strong,
    section[data-testid="stSidebar"] b    { color: #f1f5f9 !important; }
    section[data-testid="stSidebar"] label { color: #cbd5e1 !important; font-weight: 500 !important; font-size: .8rem !important; }

    /* dropzone */
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"] {
        background: #1f2937 !important;
        border: 2px dashed #374151 !important;
        border-radius: var(--r2) !important;
        padding: 22px 14px !important;
        text-align: center !important;
        transition: all .2s ease !important;
        cursor: pointer !important;
    }
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"]:hover {
        border-color: var(--indigo) !important;
        background: rgba(79,70,229,.08) !important;
    }
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"] * { color: #6b7280 !important; font-size: .8rem !important; }
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"] svg { opacity: .4; }
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"] button {
        background: #111827 !important; color: #e5e7eb !important;
        border: 1px solid #374151 !important; border-radius: var(--r1) !important;
        font-size: .78rem !important; padding: 5px 14px !important; font-weight: 500 !important; margin-top: 8px !important;
        transition: all .2s !important;
    }
    section[data-testid="stSidebar"] [data-testid="stFileUploaderDropzone"] button:hover {
        background: var(--indigo) !important; border-color: var(--indigo) !important; color: white !important;
    }
    section[data-testid="stSidebar"] .stSuccess {
        background: rgba(16,185,129,.10) !important; border: 1px solid rgba(16,185,129,.30) !important;
        border-radius: var(--r1) !important; margin-top: 6px !important;
    }
    section[data-testid="stSidebar"] .stSuccess p { color: #6ee7b7 !important; font-size: .82rem !important; }

    /* ═══════════════════════════════════
       HERO  (contained card, no hacks)
    ═══════════════════════════════════ */
    .hero {
        background: linear-gradient(135deg, #1e1b4b 0%, #3730a3 45%, #4338ca 75%, #2563eb 100%);
        border-radius: var(--r4);
        padding: 2.5rem 2.5rem 2.75rem;
        margin-bottom: 1.75rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 12px 40px rgba(67,56,202,.35);
    }
    .hero::before {
        content: '';
        position: absolute; top: -120px; right: -80px;
        width: 360px; height: 360px;
        background: radial-gradient(circle, rgba(255,255,255,.07) 0%, transparent 60%);
        border-radius: 50%; pointer-events: none;
    }
    .hero::after {
        content: '';
        position: absolute; bottom: -100px; left: 35%;
        width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(139,92,246,.18) 0%, transparent 60%);
        border-radius: 50%; pointer-events: none;
    }
    .hero-body   { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
    .hero-left   { flex: 1; }
    .hero-badge  {
        display: inline-flex; align-items: center; gap: 6px;
        background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.22);
        color: #c7d2fe !important; border-radius: 999px;
        padding: 4px 14px; font-size: .72rem; font-weight: 700;
        letter-spacing: .6px; text-transform: uppercase; margin-bottom: .875rem;
    }
    .hero-h1 {
        font-size: 2rem !important; font-weight: 800 !important;
        color: #ffffff !important; letter-spacing: -.5px !important;
        line-height: 1.15 !important; margin: 0 0 .625rem !important;
    }
    .hero-h1 .accent { color: #a5b4fc !important; }
    .hero-p {
        color: #c7d2fe !important; font-size: .9rem !important;
        line-height: 1.65 !important; margin: 0 !important; max-width: 460px;
    }
    .hero-stats  { display: flex; gap: .875rem; flex-shrink: 0; }
    .hero-stat   {
        background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.16);
        border-radius: var(--r3); padding: 1.1rem 1.4rem; text-align: center;
        backdrop-filter: blur(8px); min-width: 92px;
    }
    .hero-stat .sn { font-size: 1.8rem; font-weight: 800; color: #fff !important; line-height: 1; }
    .hero-stat .sl { font-size: .66rem; color: #a5b4fc !important; margin-top: 4px; text-transform: uppercase; letter-spacing: .55px; font-weight: 600; }

    /* ═══════════════════════════════════
       TABS
    ═══════════════════════════════════ */
    .stTabs [data-baseweb="tab-list"] {
        background: var(--surface) !important;
        border: 1.5px solid var(--border) !important;
        border-radius: 999px !important;
        padding: 4px !important;
        gap: 2px !important;
        box-shadow: var(--sh1) !important;
        margin-bottom: 1.75rem !important;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 999px !important;
        font-weight: 500 !important; font-size: .84rem !important;
        padding: 8px 20px !important;
        transition: all .18s !important;
        background: transparent !important; color: var(--t3) !important;
        border-bottom: none !important;
    }
    .stTabs [data-baseweb="tab"]:hover { background: var(--surface-2) !important; color: var(--t2) !important; }
    .stTabs [aria-selected="true"] {
        background: var(--indigo) !important; color: #fff !important;
        box-shadow: var(--sh-indigo) !important;
    }
    .stTabs [aria-selected="true"] p,
    .stTabs [aria-selected="true"] span,
    .stTabs [aria-selected="true"] div { color: #fff !important; }
    .stTabs [data-baseweb="tab"] p,
    .stTabs [data-baseweb="tab"] span  { color: inherit !important; }
    .stTabs [data-baseweb="tab-highlight"] { display: none !important; }
    .stTabs [data-baseweb="tab-border"]    { display: none !important; }

    /* ═══════════════════════════════════
       SECTION TITLE
    ═══════════════════════════════════ */
    .sec-title {
        font-size: 1.05rem !important; font-weight: 700 !important;
        color: var(--t1) !important; margin: 0 0 1.4rem !important;
        padding-bottom: .875rem !important;
        border-bottom: 2px solid var(--border) !important;
        display: flex !important; align-items: center !important; gap: 9px !important;
    }

    /* ═══════════════════════════════════
       CARDS
    ═══════════════════════════════════ */
    .stat-card {
        background: var(--surface); border: 1.5px solid var(--border);
        border-radius: var(--r3); padding: 1.4rem 1rem; text-align: center;
        box-shadow: var(--sh1); transition: all .22s ease;
    }
    .stat-card:hover { box-shadow: var(--sh2); transform: translateY(-2px); border-color: var(--border-2); }
    .stat-val {
        font-size: 2.5rem !important; font-weight: 800 !important;
        line-height: 1 !important; letter-spacing: -.5px !important;
    }
    .stat-lbl {
        font-size: .7rem !important; color: var(--t3) !important;
        margin-top: 8px !important; font-weight: 600 !important;
        text-transform: uppercase !important; letter-spacing: .5px !important;
    }

    .result-card {
        background: var(--surface); border: 1.5px solid var(--border);
        border-radius: var(--r3); padding: 2rem;
        font-size: .9rem; line-height: 1.8;
        color: var(--t2) !important; box-shadow: var(--sh1); margin-top: 1rem;
    }
    .result-card p,.result-card li,
    .result-card span,.result-card div { color: var(--t2) !important; }
    .result-card b,.result-card strong  { color: var(--t1) !important; }
    .result-card h1,.result-card h2,
    .result-card h3,.result-card h4    { color: var(--t1) !important; margin-top: 1.25rem !important; }

    /* ─── empty state ─── */
    .empty {
        text-align: center; padding: 5rem 2rem;
        background: var(--surface); border: 2px dashed var(--border);
        border-radius: var(--r4); margin: .25rem 0;
    }
    .empty .ico  { font-size: 2.5rem; margin-bottom: 1rem; display: block; opacity: .7; }
    .empty h3    { font-size: 1.05rem !important; font-weight: 700 !important; color: var(--t1) !important; margin: 0 0 .5rem !important; }
    .empty p     { color: var(--t3) !important; font-size: .88rem !important; margin: 0 !important; line-height: 1.65 !important; }

    /* ─── verdict banners ─── */
    .verdict {
        border-radius: var(--r2); padding: 1rem 1.25rem;
        display: flex; align-items: center; gap: 14px; margin: .5rem 0 1.25rem;
    }
    .verdict.pass { background: var(--emerald-bg); border: 1.5px solid var(--emerald-bd); }
    .verdict.fail { background: var(--red-bg);     border: 1.5px solid var(--red-bd);     }
    .verdict .vi  { font-size: 1.6rem; flex-shrink: 0; }
    .verdict .vt  { font-weight: 700; font-size: .92rem; }
    .verdict .vs  { font-size: .78rem; margin-top: 2px; opacity: .8; }

    /* ─── progress bar ─── */
    .prog-wrap  { margin: .25rem 0 1.5rem; }
    .prog-meta  { display: flex; justify-content: space-between; font-size: .8rem; color: var(--t2); margin-bottom: 7px; font-weight: 500; }
    .prog-bg    { background: var(--border); border-radius: 999px; height: 10px; overflow: hidden; }
    .prog-fill  { height: 100%; border-radius: 999px; transition: width .6s ease; }
    .prog-marks { display: flex; justify-content: space-between; font-size: .68rem; color: var(--t3); margin-top: 4px; }

    /* ─── skill tags ─── */
    .tag { display: inline-block; padding: 4px 13px; border-radius: 999px; font-size: .78rem; font-weight: 600; margin: 3px; transition: transform .1s; }
    .tag:hover { transform: translateY(-1px); }
    .tag.ok  { background: var(--emerald-bg) !important; color: #065f46 !important; border: 1px solid var(--emerald-bd) !important; }
    .tag.no  { background: var(--red-bg)     !important; color: #991b1b !important; border: 1px solid var(--red-bd)     !important; }

    /* ═══════════════════════════════════
       BUTTONS
    ═══════════════════════════════════ */
    .stButton > button {
        font-family: 'Inter', system-ui, sans-serif !important;
        font-weight: 600 !important; font-size: .88rem !important;
        border-radius: var(--r2) !important; padding: .72rem 1.6rem !important;
        transition: all .2s ease !important;
        border: 1.5px solid var(--border) !important;
        background: var(--surface) !important; color: var(--t2) !important;
        box-shadow: var(--sh1) !important; letter-spacing: .03px !important;
    }
    .stButton > button:hover {
        background: var(--indigo) !important; border-color: var(--indigo) !important;
        color: #ffffff !important; box-shadow: var(--sh-indigo) !important;
        transform: translateY(-1px) !important;
    }
    .stButton > button:active { transform: none !important; }

    .stDownloadButton > button {
        font-family: 'Inter', system-ui, sans-serif !important;
        background: var(--surface) !important; color: var(--t2) !important;
        border: 1.5px solid var(--border) !important; border-radius: var(--r2) !important;
        font-weight: 600 !important; font-size: .85rem !important;
        padding: .68rem 1.4rem !important; transition: all .2s !important; box-shadow: var(--sh1) !important;
    }
    .stDownloadButton > button:hover {
        border-color: var(--emerald) !important; color: var(--emerald-dark) !important;
        background: var(--emerald-bg) !important; box-shadow: var(--sh-emerald) !important;
    }

    /* ═══════════════════════════════════
       INPUTS
    ═══════════════════════════════════ */
    .stTextInput > div > div > input,
    .stTextArea  > div > div > textarea {
        font-family: 'Inter', system-ui, sans-serif !important;
        border: 1.5px solid var(--border) !important; border-radius: var(--r2) !important;
        font-size: .88rem !important; color: var(--t1) !important;
        background: var(--surface) !important; padding: .68rem 1rem !important;
        transition: border-color .15s, box-shadow .15s !important; box-shadow: var(--sh1) !important;
    }
    .stTextInput > div > div > input:focus,
    .stTextArea  > div > div > textarea:focus {
        border-color: var(--indigo) !important;
        box-shadow: 0 0 0 3px rgba(79,70,229,.12) !important; outline: none !important;
    }
    .stTextInput > div > div > input::placeholder,
    .stTextArea  > div > div > textarea::placeholder { color: var(--t3) !important; }

    .stSelectbox > div > div,
    .stMultiSelect > div > div {
        border: 1.5px solid var(--border) !important; border-radius: var(--r2) !important;
        background: var(--surface) !important; color: var(--t1) !important;
        font-size: .88rem !important; box-shadow: var(--sh1) !important;
    }

    .stRadio > div {
        background: var(--surface) !important; border: 1.5px solid var(--border) !important;
        border-radius: var(--r2) !important; padding: 7px 14px !important;
        gap: 14px !important; display: inline-flex !important; width: auto !important;
        box-shadow: var(--sh1) !important;
    }
    .stRadio > div > label,
    .stRadio > div > label span,
    .stRadio label p { color: var(--t2) !important; font-size: .88rem !important; font-weight: 500 !important; }

    label, .stSelectbox label, .stMultiSelect label, .stSlider label,
    .stTextArea label, .stTextInput label, .stCheckbox label, .stCheckbox span {
        font-family: 'Inter', system-ui, sans-serif !important;
        font-size: .75rem !important; font-weight: 600 !important;
        color: var(--t2) !important; text-transform: uppercase !important; letter-spacing: .4px !important;
    }

    .stAlert { border-radius: var(--r2) !important; font-size: .88rem !important; }
    .stAlert p { color: var(--t1) !important; }

    /* ═══════════════════════════════════
       CHAT
    ═══════════════════════════════════ */
    .msg-u   { display: flex; justify-content: flex-end; margin: .5rem 0; }
    .msg-u .bub { background: var(--indigo); color: #fff !important; box-shadow: var(--sh-indigo); border-radius: 18px 18px 4px 18px; padding: .75rem 1.1rem; max-width: 72%; font-size: .88rem; line-height: 1.6; }
    .msg-b   { display: flex; align-items: flex-start; gap: 9px; margin: .5rem 0; }
    .msg-b .bub { background: var(--surface); color: var(--t2) !important; border: 1.5px solid var(--border); border-radius: 18px 18px 18px 4px; padding: .75rem 1.1rem; max-width: 78%; font-size: .88rem; line-height: 1.6; box-shadow: var(--sh1); }
    .av {
        width: 32px; height: 32px; border-radius: 50%;
        background: var(--indigo-light); border: 2px solid #c7d2fe;
        color: var(--indigo) !important; display: flex; align-items: center; justify-content: center;
        font-size: .65rem; font-weight: 800; flex-shrink: 0; margin-top: 2px;
    }

    /* ═══════════════════════════════════
       SIDEBAR COMPONENTS
    ═══════════════════════════════════ */
    .sb-brand {
        display: flex; align-items: center; gap: 11px;
        padding: .375rem 0 1.125rem;
        border-bottom: 1px solid #1f2937; margin-bottom: 1.375rem;
    }
    .sb-icon {
        width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
        background: linear-gradient(135deg, var(--indigo-dark), var(--indigo));
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem; box-shadow: 0 4px 14px rgba(79,70,229,.40);
    }
    .sb-name    { font-size: .98rem !important; font-weight: 700 !important; color: #f1f5f9 !important; margin: 0 !important; line-height: 1.2; }
    .sb-sub     { font-size: .68rem !important; color: #4b5563 !important; margin: 2px 0 0 !important; }

    .sb-box {
        background: var(--sidebar-card); border: 1px solid var(--sidebar-bd);
        border-radius: var(--r2); padding: .875rem 1rem; margin-bottom: .875rem;
    }
    .sb-box-head {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: .75rem;
    }
    .sb-box-title { display: flex; align-items: center; gap: 7px; font-size: .76rem !important; font-weight: 700 !important; color: #e2e8f0 !important; text-transform: uppercase !important; letter-spacing: .5px !important; margin: 0 !important; }
    .sb-pill {
        font-size: .63rem !important; font-weight: 700 !important;
        padding: 2px 9px !important; border-radius: 999px !important;
    }
    .sb-pill-req { background: rgba(79,70,229,.18) !important; color: #a5b4fc !important; border: 1px solid rgba(79,70,229,.35) !important; }
    .sb-pill-opt { background: rgba(245,158,11,.12) !important; color: #fcd34d !important; border: 1px solid rgba(245,158,11,.30) !important; }

    .sb-status {
        background: rgba(255,255,255,.03); border: 1px solid #1f2937;
        border-radius: var(--r2); padding: .75rem .875rem; margin-top: .25rem;
    }
    .sb-row {
        display: flex; align-items: center; gap: 9px;
        font-size: .8rem; color: #94a3b8 !important; padding: 4px 0;
    }
    .sb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

    hr { border-color: var(--border) !important; margin: 1.25rem 0 !important; }

    @media (max-width: 768px) {
        .main .block-container { padding: 1.5rem 1rem 3rem !important; }
        .hero-body { flex-direction: column; gap: 1.25rem; }
        .hero-stats { justify-content: center; }
    }
    </style>
    """, unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────────
#  SIDEBAR
# ─────────────────────────────────────────────────────────────────
def render_sidebar():
    with st.sidebar:
        # Brand
        st.markdown("""
        <div class="sb-brand">
            <div class="sb-icon">🤖</div>
            <div>
                <div class="sb-name">Recruitment AI</div>
                <div class="sb-sub">Groq · LLaMA 3.3 70B</div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        # Resume box
        st.markdown("""
        <div class="sb-box">
            <div class="sb-box-head">
                <span class="sb-box-title">📄 Resume</span>
                <span class="sb-pill sb-pill-req">Required</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        resume_file = st.file_uploader(
            "Upload resume (PDF or TXT)",
            type=["pdf", "txt"], key="resume_upload",
            label_visibility="collapsed"
        )
        if resume_file:
            with st.spinner("Parsing resume…"):
                agent = st.session_state.agent
                text = agent.extract_text_from(resume_file)
                st.session_state.resume_text = text
                agent.resume_text = text
                agent.create_rag_vector_store(text)
            st.success("✅ Resume loaded")

        st.markdown("<div style='height:.75rem'></div>", unsafe_allow_html=True)

        # JD box
        st.markdown("""
        <div class="sb-box">
            <div class="sb-box-head">
                <span class="sb-box-title">📋 Job Description</span>
                <span class="sb-pill sb-pill-opt">Optional</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        jd_file = st.file_uploader(
            "Upload job description (PDF or TXT)",
            type=["pdf", "txt"], key="jd_upload",
            label_visibility="collapsed"
        )
        if jd_file:
            with st.spinner("Parsing JD…"):
                agent = st.session_state.agent
                text = agent.extract_text_from(jd_file)
                st.session_state.jd_text = text
                agent.jd_text = text
            st.success("✅ JD loaded")

        # Status strip
        r_ready = bool(st.session_state.get("resume_text"))
        j_ready = bool(st.session_state.get("jd_text"))
        st.markdown(f"""
        <div class="sb-status">
            <div class="sb-row">
                <div class="sb-dot" style="background:{'#10b981' if r_ready else '#374151'}"></div>
                <span>Resume</span>
                <span style="margin-left:auto;font-weight:700;color:{'#34d399' if r_ready else '#6b7280'} !important">{'Ready' if r_ready else 'Not uploaded'}</span>
            </div>
            <div class="sb-row">
                <div class="sb-dot" style="background:{'#10b981' if j_ready else '#f59e0b'}"></div>
                <span>Job Description</span>
                <span style="margin-left:auto;font-weight:700;color:{'#34d399' if j_ready else '#fbbf24'} !important">{'Ready' if j_ready else 'Optional'}</span>
            </div>
        </div>
        <p style="font-size:.62rem;color:#1f2937;text-align:center;margin:1.25rem 0 0;letter-spacing:.3px">
            © 2026 Recruitment AI Agent · v1.0
        </p>
        """, unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────────
#  TABS
# ─────────────────────────────────────────────────────────────────
def render_analysis_tab():
    st.markdown('<div class="sec-title">📊 Resume Analysis</div>', unsafe_allow_html=True)

    if not st.session_state.get("resume_text"):
        st.markdown("""
        <div class="empty">
            <span class="ico">📄</span>
            <h3>Upload a resume to begin</h3>
            <p>Drop your PDF or TXT resume in the sidebar.<br>
            The AI will score it for ATS compatibility and extract key skills.</p>
        </div>""", unsafe_allow_html=True)
        return

    col_mode, col_warn = st.columns([2, 3])
    with col_mode:
        mode = st.radio("mode", ["ATS Keywords", "Job Description"],
                        horizontal=True, label_visibility="collapsed")
    with col_warn:
        if mode == "Job Description" and not st.session_state.get("jd_text"):
            st.warning("⚠️ Upload a Job Description in the sidebar to use this mode.")

    st.markdown("")
    if st.button("🔍  Analyze Resume", key="analyze_btn", use_container_width=True):
        with st.spinner("Analyzing your resume with AI…"):
            agent = st.session_state.agent
            result = agent.analyze_resume(
                st.session_state.resume_text,
                st.session_state.get("jd_text"),
                mode="jd" if mode == "Job Description" else "ats"
            )
            st.session_state.analysis_result = result

    if not st.session_state.get("analysis_result"):
        return

    result    = st.session_state.analysis_result
    score     = result["score"]
    selected  = result["selected"]
    strengths = result["strengths"]
    weaknesses= result["weaknesses"]
    total     = result["total_skills"]
    matched   = len(strengths)
    missing   = len(weaknesses)

    st.markdown("---")

    # ── Stat cards ──
    c1, c2, c3 = st.columns(3)
    sc = "#10b981" if selected else "#ef4444"
    with c1:
        st.markdown(f'<div class="stat-card"><div class="stat-val" style="color:{sc}">{score}</div><div class="stat-lbl">ATS Score / 100</div></div>', unsafe_allow_html=True)
    with c2:
        st.markdown(f'<div class="stat-card"><div class="stat-val" style="color:#10b981">{matched}</div><div class="stat-lbl">Skills Matched</div></div>', unsafe_allow_html=True)
    with c3:
        st.markdown(f'<div class="stat-card"><div class="stat-val" style="color:#ef4444">{missing}</div><div class="stat-lbl">Skills Missing</div></div>', unsafe_allow_html=True)

    st.markdown("")

    # ── Verdict ──
    if selected:
        st.markdown(f"""
        <div class="verdict pass">
            <div class="vi">✅</div>
            <div>
                <div class="vt" style="color:#065f46">SELECTED — Meets the cutoff threshold</div>
                <div class="vs" style="color:#059669">Score {score}/100 exceeds the required 75/100 minimum</div>
            </div>
        </div>""", unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div class="verdict fail">
            <div class="vi">❌</div>
            <div>
                <div class="vt" style="color:#991b1b">NOT SELECTED — Below the cutoff threshold</div>
                <div class="vs" style="color:#dc2626">Score {score}/100 is below the required 75/100 minimum</div>
            </div>
        </div>""", unsafe_allow_html=True)

    # ── Progress ──
    bc = "#10b981" if selected else "#ef4444"
    st.markdown(f"""
    <div class="prog-wrap">
        <div class="prog-meta"><span>ATS Compatibility Score</span><span style="font-weight:700;color:{bc}">{score}%</span></div>
        <div class="prog-bg"><div class="prog-fill" style="width:{score}%;background:{bc}"></div></div>
        <div class="prog-marks"><span>0</span><span>▲ Cutoff: 75</span><span>100</span></div>
    </div>""", unsafe_allow_html=True)

    # ── Chart + skills ──
    col_l, col_r = st.columns(2)
    with col_l:
        st.markdown("**Skills Breakdown**")
        fig, ax = plt.subplots(figsize=(3.5, 3.5), facecolor='none')
        sizes = [max(matched, 0.01), max(missing, 0.01)]
        _, _, autotexts = ax.pie(
            sizes, labels=['Matched', 'Missing'], colors=['#10b981', '#ef4444'],
            autopct='%1.0f%%', startangle=90,
            wedgeprops=dict(width=0.52, edgecolor='white', linewidth=2.5),
            textprops={'fontsize': 10, 'color': '#475569'}
        )
        for at in autotexts:
            at.set_color('white'); at.set_fontsize(9); at.set_fontweight('bold')
        ax.set_facecolor('none'); fig.patch.set_alpha(0)
        st.pyplot(fig); plt.close()

    with col_r:
        st.markdown("**✅ Matched Skills**")
        if strengths:
            st.markdown("".join(f'<span class="tag ok">{s}</span>' for s in strengths), unsafe_allow_html=True)
        else:
            st.markdown('<span style="color:#94a3b8;font-size:.85rem">None matched</span>', unsafe_allow_html=True)
        st.markdown("<br>**❌ Missing Skills**", unsafe_allow_html=True)
        if weaknesses:
            st.markdown("".join(f'<span class="tag no">{s}</span>' for s in weaknesses), unsafe_allow_html=True)
        else:
            st.markdown('<span style="color:#10b981;font-size:.85rem">All skills matched! 🎉</span>', unsafe_allow_html=True)

    # ── Downloads ──
    st.markdown("---")
    d1, d2 = st.columns(2)
    with d1:
        if PDF_AVAILABLE:
            try:
                pdf_bytes = generate_pdf_report(score, selected, strengths, weaknesses, total)
                st.download_button("📥  Download PDF Report", pdf_bytes,
                                   file_name="resume_analysis_report.pdf",
                                   mime="application/pdf", use_container_width=True)
            except Exception:
                st.download_button("📥  Download Report", _text_report(score, selected, strengths, weaknesses),
                                   file_name="analysis_report.txt", mime="text/plain", use_container_width=True)
        else:
            st.download_button("📥  Download Report", _text_report(score, selected, strengths, weaknesses),
                               file_name="analysis_report.txt", mime="text/plain", use_container_width=True)
    with d2:
        if st.button("🔄  Re-analyze", key="reanalyze_btn", use_container_width=True):
            st.session_state.analysis_result = None
            st.rerun()


def _text_report(score, selected, strengths, weaknesses):
    lines = ["RESUME ANALYSIS REPORT", "Generated by Recruitment AI Agent", "="*45,
             f"SCORE:  {score}/100", f"STATUS: {'SELECTED' if selected else 'NOT SELECTED'}", "CUTOFF: 75/100",
             "", f"STRENGTHS ({len(strengths)} matched):"]
    lines += [f"  • {s}" for s in strengths]
    lines += ["", f"MISSING SKILLS ({len(weaknesses)}):"]
    lines += [f"  • {w}" for w in weaknesses]
    lines += ["", "VERDICT:", "Proceed to interview." if selected else "Strengthen missing skills before reapplying."]
    return "\n".join(lines)


def render_chat_tab():
    st.markdown('<div class="sec-title">💬 Chat with Resume</div>', unsafe_allow_html=True)

    if not st.session_state.get("resume_text"):
        st.markdown("""
        <div class="empty">
            <span class="ico">💬</span>
            <h3>No resume loaded yet</h3>
            <p>Upload your resume in the sidebar, then ask any question<br>about the candidate's background, skills, or experience.</p>
        </div>""", unsafe_allow_html=True)
        return

    for msg in st.session_state.get("chat_history", []):
        if msg["role"] == "user":
            st.markdown(f'<div class="msg-u"><div class="bub">{msg["content"]}</div></div>', unsafe_allow_html=True)
        else:
            st.markdown(f'<div class="msg-b"><div class="av">AI</div><div class="bub">{msg["content"]}</div></div>', unsafe_allow_html=True)

    st.markdown("")
    c1, c2 = st.columns([5, 1])
    with c1:
        question = st.text_input("q", placeholder="Ask anything about the resume…",
                                 key="chat_input", label_visibility="collapsed")
    with c2:
        send = st.button("Send →", key="send_btn")

    if send and question:
        st.session_state.chat_history.append({"role": "user", "content": question})
        with st.spinner("Thinking…"):
            answer = st.session_state.agent.ask_question(question)
        st.session_state.chat_history.append({"role": "bot", "content": answer})
        st.rerun()

    if st.session_state.get("chat_history"):
        if st.button("🗑️  Clear conversation", key="clear_chat"):
            st.session_state.chat_history = []
            st.rerun()

    if not st.session_state.get("chat_history"):
        st.markdown("**💡 Try asking:**")
        suggestions = [
            "What are the candidate's top technical skills?",
            "How many years of experience do they have?",
            "What projects have they built?",
            "What is their highest qualification?",
        ]
        cols = st.columns(2)
        for i, s in enumerate(suggestions):
            with cols[i % 2]:
                if st.button(s, key=f"sug_{i}", use_container_width=True):
                    st.session_state.chat_history.append({"role": "user", "content": s})
                    with st.spinner("Thinking…"):
                        answer = st.session_state.agent.ask_question(s)
                    st.session_state.chat_history.append({"role": "bot", "content": answer})
                    st.rerun()


def render_questions_tab():
    st.markdown('<div class="sec-title">❓ Interview Question Generator</div>', unsafe_allow_html=True)

    if not st.session_state.get("resume_text"):
        st.markdown("""
        <div class="empty">
            <span class="ico">❓</span>
            <h3>No resume uploaded</h3>
            <p>Upload a resume to generate personalized interview questions<br>tailored to the candidate's background and target role.</p>
        </div>""", unsafe_allow_html=True)
        return

    c1, c2, c3 = st.columns(3)
    with c1:
        q_type = st.selectbox("Question Type", ["Technical","Behavioral","Coding","Scenario-based","Experience-based","Project-based"])
    with c2:
        difficulty = st.selectbox("Difficulty Level", ["Easy","Medium","Hard"])
    with c3:
        count = st.slider("Number of Questions", 3, 15, 5)

    if st.button("⚡  Generate Questions", key="gen_q", use_container_width=True):
        with st.spinner("Generating personalized questions…"):
            questions = st.session_state.agent.generate_interview_questions(q_type, difficulty, count)
        st.markdown('<div class="result-card">', unsafe_allow_html=True)
        st.markdown(questions)
        st.markdown('</div>', unsafe_allow_html=True)
        st.download_button("📥  Download Questions", questions, file_name="interview_questions.txt", mime="text/plain")


def render_improvements_tab():
    st.markdown('<div class="sec-title">💡 Resume Improvement Suggestions</div>', unsafe_allow_html=True)

    if not st.session_state.get("resume_text"):
        st.markdown("""
        <div class="empty">
            <span class="ico">💡</span>
            <h3>No resume uploaded</h3>
            <p>Upload a resume to get AI-powered suggestions for<br>improving each section and boosting ATS scores.</p>
        </div>""", unsafe_allow_html=True)
        return

    sections = st.multiselect(
        "Select sections to improve",
        ["Skills","Projects","Experience","Achievements","Overall Structure"],
        default=["Skills","Overall Structure"]
    )
    if st.button("💡  Get Suggestions", key="suggest_btn", use_container_width=True):
        if not sections:
            st.warning("Select at least one section to improve.")
            return
        with st.spinner("Analyzing resume…"):
            suggestions = st.session_state.agent.suggest_improvements(sections)
        st.markdown('<div class="result-card">', unsafe_allow_html=True)
        st.markdown(suggestions)
        st.markdown('</div>', unsafe_allow_html=True)


def render_generate_tab():
    st.markdown('<div class="sec-title">✨ Generate Improved Resume</div>', unsafe_allow_html=True)

    if not st.session_state.get("resume_text"):
        st.markdown("""
        <div class="empty">
            <span class="ico">✨</span>
            <h3>No resume uploaded</h3>
            <p>Upload your existing resume and enter a target role<br>to receive an AI-optimized, tailored version.</p>
        </div>""", unsafe_allow_html=True)
        return

    c1, c2 = st.columns([3, 1])
    with c1:
        job_role = st.text_input("Target role", placeholder="e.g. Data Scientist · Backend Engineer · AI Engineer",
                                 label_visibility="collapsed")
    with c2:
        use_jd = st.checkbox("Tailor to JD", value=bool(st.session_state.get("jd_text")))

    if st.button("✨  Generate Improved Resume", key="gen_res", use_container_width=True):
        if not job_role:
            st.warning("Enter a target job role first.")
            return
        with st.spinner("Generating your optimized resume…"):
            jd = st.session_state.get("jd_text") if use_jd else None
            improved = st.session_state.agent.generate_improved_resume(job_role, jd)
        st.markdown('<div class="result-card">', unsafe_allow_html=True)
        st.markdown(improved)
        st.markdown('</div>', unsafe_allow_html=True)
        d1, d2 = st.columns(2)
        with d1:
            st.download_button("📥  Download as Markdown", improved, file_name="improved_resume.md", mime="text/markdown", use_container_width=True)
        with d2:
            st.download_button("📥  Download as Text", improved, file_name="improved_resume.txt", mime="text/plain", use_container_width=True)


# ─────────────────────────────────────────────────────────────────
#  MAIN RENDER
# ─────────────────────────────────────────────────────────────────
def render_ui():
    apply_styles()

    # ── Hero ──────────────────────────────────────────────────────
    st.markdown("""
    <div class="hero">
        <div class="hero-body">
            <div class="hero-left">
                <div class="hero-badge">✦ AI-Powered &nbsp;·&nbsp; Beta v1.0</div>
                <div class="hero-h1">Recruitment <span class="accent">AI Agent</span></div>
                <div class="hero-p">
                    Instantly analyze resumes, score ATS compatibility, generate
                    interview questions, and create optimized resumes —
                    powered by LLaMA&nbsp;3.3&nbsp;70B.
                </div>
            </div>
            <div class="hero-stats">
                <div class="hero-stat"><div class="sn">5</div><div class="sl">AI Tools</div></div>
                <div class="hero-stat"><div class="sn">∞</div><div class="sl">Resumes</div></div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    render_sidebar()

    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📊  Analysis", "💬  Chat", "❓  Questions", "💡  Improvements", "✨  Generate",
    ])
    with tab1: render_analysis_tab()
    with tab2: render_chat_tab()
    with tab3: render_questions_tab()
    with tab4: render_improvements_tab()
    with tab5: render_generate_tab()
