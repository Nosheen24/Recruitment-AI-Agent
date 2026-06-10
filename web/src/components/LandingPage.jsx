import { useState, useEffect, useRef } from 'react'
import {
  BarChart2, MessageCircle, HelpCircle, Lightbulb, Wand2,
  Users, Building2, Check, ArrowRight, Zap, Shield,
  FileText, Brain, TrendingUp, Clock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/* ── Scroll-triggered fade-in ─────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}
         style={{
           opacity:    visible ? 1 : 0,
           transform:  visible ? 'translateY(0)' : 'translateY(30px)',
           transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
         }}>
      {children}
    </div>
  )
}

/* ── Navbar ───────────────────────────────────────────── */
function LandingNav({ onSelect, onShowLogin }) {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(3,7,18,.96)' : 'rgba(3,7,18,.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : '1px solid transparent',
            }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,.4)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight font-display">
            Recruitment<span className="text-indigo-400"> AI</span>
          </span>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[
            { label: 'For Candidates', href: '#candidates' },
            { label: 'For HR Teams',   href: '#hr'         },
            { label: 'How It Works',   href: '#how'        },
            { label: 'Features',       href: '#features'   },
          ].map(({ label, href }) => (
            <a key={label} href={href}
               className="nav-link text-sm text-slate-400 hover:text-white transition-colors duration-150 font-medium">
              {label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            <span className="hidden sm:block text-sm text-slate-400 font-medium">{user.name.split(' ')[0]}</span>
          ) : (
            <button onClick={onShowLogin}
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-150">
              Sign In
            </button>
          )}
          <button onClick={() => onSelect('candidate')}
                  className="btn-primary text-sm font-bold text-white px-5 py-2.5 rounded-xl">
            Get Started Free
          </button>
        </div>
      </div>
    </header>
  )
}

/* ── Hero ─────────────────────────────────────────────── */
function Hero({ onSelect }) {
  return (
    <section className="hero-bg min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden">
      <div className="hero-grid" />
      <div className="hero-noise" />

      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full animate-orbPulse"
             style={{ background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,.32) 0%, rgba(99,102,241,.08) 45%, transparent 68%)', filter: 'blur(56px)' }} />
        <div className="absolute -bottom-56 -left-56 w-[750px] h-[750px] rounded-full animate-orbPulse"
             style={{ background: 'radial-gradient(circle at 65% 65%, rgba(124,58,237,.26) 0%, rgba(124,58,237,.06) 45%, transparent 68%)', filter: 'blur(64px)', animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(59,130,246,.07) 0%, transparent 62%)', filter: 'blur(40px)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">
            AI-Powered Recruitment Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-white leading-[1.06] tracking-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 8.5vw, 5.75rem)' }}>
          Hire Smarter.
          <br />
          <span className="gradient-text">Apply Stronger.</span>
        </h1>

        {/* Sub */}
        <p className="text-slate-400 leading-relaxed mb-10 mx-auto"
           style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', maxWidth: '580px' }}>
          The AI recruitment platform that helps candidates land their dream job —
          and HR teams find the right hire, 10× faster.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-20 flex-wrap">
          <button onClick={() => onSelect('candidate')}
                  className="btn-primary inline-flex items-center gap-2.5 font-bold text-white px-8 py-4 rounded-2xl text-base">
            Start Analyzing Free
            <ArrowRight size={18} />
          </button>
          <button onClick={() => onSelect('hr')}
                  className="inline-flex items-center gap-2.5 font-semibold text-slate-300 hover:text-white px-8 py-4 rounded-2xl text-base transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
            <Building2 size={18} />
            For HR Teams
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: '5',    label: 'AI-Powered Tools',  color: 'text-indigo-400'  },
            { value: '< 5s', label: 'Analysis Time',     color: 'text-violet-400'  },
            { value: '50+',  label: 'Resumes at Once',   color: 'text-cyan-400'    },
            { value: 'Free', label: 'To Get Started',    color: 'text-emerald-400' },
          ].map(({ value, label, color }) => (
            <div key={label} className="glass-stat rounded-2xl px-4 py-5 text-center">
              <div className={`text-2xl font-black font-display leading-none mb-1.5 ${color}`}>{value}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint flex flex-col items-center gap-1.5">
        <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

/* ── Stats strip ──────────────────────────────────────── */
function StatsStrip() {
  return (
    <section className="py-12"
             style={{ background: '#07091a', borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-xs font-bold text-slate-600 uppercase tracking-widest mb-10">
          Everything you need, in one platform
        </p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {[
            { icon: Brain,    n: '5',    label: 'AI Tools'          },
            { icon: Zap,      n: '< 5s', label: 'Resume Analysis'   },
            { icon: Users,    n: '50+',  label: 'Bulk Screening'    },
            { icon: FileText, n: 'PDF',  label: 'Export'            },
            { icon: Shield,   n: '100%', label: 'Free to Start'     },
          ].map(({ icon: Icon, n, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon size={16} className="text-indigo-400 mb-0.5" />
              <span className="text-2xl font-black text-white font-display leading-none">{n}</span>
              <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Features ─────────────────────────────────────────── */
function Features() {
  const FEATURES = [
    {
      Icon: BarChart2, title: 'ATS Resume Scoring',
      desc: 'Upload your resume + a job description. AI extracts required skills and scores you 0–100 with a matched/missing keyword breakdown.',
      color: '#6366f1', glow: 'rgba(99,102,241,.15)',
    },
    {
      Icon: MessageCircle, title: 'Chat with Your Resume',
      desc: 'Ask natural language questions. "What are my strongest skills?" "Does my resume mention React?" — instant, context-aware AI answers.',
      color: '#8b5cf6', glow: 'rgba(139,92,246,.15)',
    },
    {
      Icon: HelpCircle, title: 'Interview Question Generator',
      desc: 'Generate role-specific questions from your resume. Pick type (Technical, Behavioral) and difficulty. Walk in prepared.',
      color: '#0ea5e9', glow: 'rgba(14,165,233,.15)',
    },
    {
      Icon: Lightbulb, title: 'Smart Improvements',
      desc: 'Get specific ISSUE / BEFORE / AFTER suggestions for every resume section. Actionable feedback, not vague advice.',
      color: '#f59e0b', glow: 'rgba(245,158,11,.15)',
    },
    {
      Icon: Wand2, title: 'AI Resume Generator',
      desc: 'Paste a target role and let AI rewrite your entire resume — ATS-optimized, professionally structured, downloadable as PDF.',
      color: '#10b981', glow: 'rgba(16,185,129,.15)',
    },
    {
      Icon: TrendingUp, title: 'HR Bulk Screening',
      desc: 'Upload your entire applicant pool + JD. Get an instant ranked shortlist with skill match % per candidate and a PDF report.',
      color: '#f43f5e', glow: 'rgba(244,63,94,.15)',
    },
  ]

  return (
    <section id="features" className="py-24" style={{ background: '#030712' }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-4">
            Features
          </span>
          <h2 className="font-display font-black text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
            Six tools. One platform.
          </h2>
          <p className="text-slate-400 text-base mx-auto leading-relaxed" style={{ maxWidth: 480 }}>
            Everything candidates and hiring teams need to move faster and make smarter decisions.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ Icon, title, desc, color, glow }, i) => (
            <FadeIn key={title} delay={i * 75}>
              <div className="landing-feature-card rounded-2xl p-6 h-full"
                   style={{
                     background: 'rgba(255,255,255,.04)',
                     border:     '1px solid rgba(255,255,255,.07)',
                     borderTop:  `3px solid ${color}`,
                   }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: glow }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-white text-[15px] mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── How it works ─────────────────────────────────────── */
function HowItWorks({ onSelect }) {
  const STEPS = [
    { n: '01', title: 'Upload Your Resume',      desc: 'Drag and drop your PDF or .txt resume. Optionally add a job description to score yourself against a specific role.' },
    { n: '02', title: 'AI Analyzes in Seconds',  desc: 'The AI extracts skills, scores compatibility, and identifies exactly what is matched and what is missing from your resume.' },
    { n: '03', title: 'Get Actionable Insights', desc: 'Use the chat, improvement suggestions, or question generator to understand your gaps and prepare for your interview.' },
    { n: '04', title: 'Download & Apply',         desc: 'Generate an AI-optimized resume and export a professional A4 PDF. Apply with confidence knowing you are prepared.' },
  ]

  return (
    <section id="how" className="py-24" style={{ background: '#07091a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 mb-4">
            How It Works
          </span>
          <h2 className="font-display font-black text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
            From upload to offer
            <br />
            <span className="gradient-text">in under 60 seconds.</span>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STEPS.map(({ n, title, desc }, i) => (
            <FadeIn key={n} delay={i * 90}>
              <div className="relative p-6 rounded-2xl h-full"
                   style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px z-10"
                       style={{ background: 'linear-gradient(90deg,rgba(99,102,241,.5),transparent)' }} />
                )}
                <div className="text-4xl font-black mb-4 font-display select-none"
                     style={{
                       background: 'linear-gradient(135deg, rgba(99,102,241,.7) 0%, rgba(139,92,246,.35) 100%)',
                       WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                     }}>
                  {n}
                </div>
                <h3 className="font-bold text-white text-[15px] mb-2 leading-snug">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center">
          <button onClick={() => onSelect('candidate')}
                  className="btn-primary inline-flex items-center gap-2.5 font-bold text-white px-8 py-4 rounded-2xl text-base">
            Try It Now — Free
            <ArrowRight size={18} />
          </button>
        </FadeIn>
      </div>
    </section>
  )
}

/* ── For Candidates ───────────────────────────────────── */
function ForCandidates({ onSelect }) {
  return (
    <section id="candidates" className="py-24" style={{ background: '#030712' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <FadeIn>
            <span className="inline-block text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-6">
              For Candidates
            </span>
            <h2 className="font-display font-black text-white mb-5 leading-[1.1]"
                style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.9rem)' }}>
              Stop guessing.
              <br />
              <span className="gradient-text">Start getting interviews.</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Most resumes are rejected by ATS systems before a human reads them.
              Our AI tells you exactly why — and fixes it for you.
            </p>
            <ul className="space-y-3 mb-9">
              {[
                'Instant ATS compatibility score (0–100)',
                'Matched and missing keyword breakdown',
                'AI chat — ask anything about your resume',
                'Role-specific interview question prep',
                'Section-by-section improvement suggestions',
                'One-click AI resume rewrite + PDF export',
              ].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(99,102,241,.18)', border: '1px solid rgba(99,102,241,.4)' }}>
                    <Check size={10} className="text-indigo-400" strokeWidth={3} />
                  </div>
                  <span className="text-slate-300 text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => onSelect('candidate')}
                    className="btn-primary inline-flex items-center gap-2.5 font-bold text-white px-7 py-3.5 rounded-2xl text-sm">
              Enter Candidate Mode
              <ArrowRight size={16} />
            </button>
          </FadeIn>

          {/* Right — mock score card */}
          <FadeIn delay={160}>
            <div className="rounded-3xl p-7 relative overflow-hidden"
                 style={{ background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.18)' }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'radial-gradient(circle at 70% 20%, rgba(99,102,241,.14) 0%, transparent 60%)' }} />
              <div className="relative space-y-4">
                {/* Score card */}
                <div className="glass-stat rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      Selected ✓
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-5xl font-black text-white font-display leading-none">82</span>
                    <span className="text-slate-500 text-sm mb-1">/100</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }}>
                    <div className="h-full rounded-full" style={{ width: '82%', background: 'linear-gradient(90deg,#6366f1,#10b981)' }} />
                  </div>
                </div>
                {/* Skills grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-stat rounded-xl p-3.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Matched</p>
                    <div className="flex flex-wrap gap-1">
                      {['Python', 'SQL', 'React', 'AWS'].map(s => (
                        <span key={s} className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="glass-stat rounded-xl p-3.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Missing</p>
                    <div className="flex flex-wrap gap-1">
                      {['Docker', 'Kubernetes'].map(s => (
                        <span key={s} className="text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Chat preview */}
                <div className="glass-stat rounded-xl p-3.5 space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Chat</p>
                  <div className="flex justify-end">
                    <div className="text-xs text-white bg-indigo-500/30 border border-indigo-500/25 px-3 py-1.5 rounded-xl rounded-br-sm max-w-[80%]">
                      What are my top 3 skills?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="text-xs text-slate-300 bg-white/5 border border-white/8 px-3 py-1.5 rounded-xl rounded-bl-sm max-w-[90%]">
                      Based on your resume: Python, Machine Learning, and SQL are your strongest skills.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ── For HR ───────────────────────────────────────────── */
function ForHR({ onSelect }) {
  return (
    <section id="hr" className="py-24" style={{ background: '#07091a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — mock rankings */}
          <FadeIn>
            <div className="rounded-3xl p-7 relative overflow-hidden"
                 style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(14,165,233,.18)' }}>
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: 'radial-gradient(circle at 30% 70%, rgba(14,165,233,.12) 0%, transparent 60%)' }} />
              <div className="relative space-y-3">
                {/* Rankings */}
                <div className="glass-stat rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Rankings</p>
                    <span className="text-xs text-slate-500">4 candidates</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'sarah_resume.pdf', score: 91, sel: true  },
                      { name: 'john_cv.pdf',      score: 78, sel: true  },
                      { name: 'mike_resume.pdf',  score: 64, sel: false },
                      { name: 'lisa_cv.pdf',      score: 51, sel: false },
                    ].map(({ name, score, sel }, i) => (
                      <div key={name} className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                           style={{ background: i < 2 ? 'rgba(99,102,241,.08)' : 'rgba(255,255,255,.03)' }}>
                        <span className="text-xs font-black text-slate-500 w-5">#{i+1}</span>
                        <span className="text-xs text-slate-300 flex-1 truncate font-medium">{name}</span>
                        <span className={`text-xs font-black ${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {score}%
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sel ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
                          {sel ? 'Selected' : 'Skipped'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* PDF button */}
                <button className="w-full py-3 rounded-xl text-sm font-bold text-sky-300 flex items-center justify-center gap-2 transition-colors"
                        style={{ background: 'rgba(14,165,233,.12)', border: '1px solid rgba(14,165,233,.25)' }}>
                  <FileText size={14} />
                  Download Screening Report PDF
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Right text */}
          <FadeIn delay={160}>
            <span className="inline-block text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 mb-6">
              For HR Teams
            </span>
            <h2 className="font-display font-black text-white mb-5 leading-[1.1]"
                style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.9rem)' }}>
              Screen 50 candidates
              <br />
              <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                in under a minute.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Stop reading resumes one by one. Upload your entire applicant pool,
              paste the job description, and get a ranked shortlist — instantly.
            </p>
            <ul className="space-y-3 mb-9">
              {[
                'Bulk upload 2–50 resumes at once',
                'AI extracts required skills from your JD',
                'Every candidate scored and ranked by fit',
                'Auto-shortlist your top N candidates',
                'Save and restore screening sessions',
                'Download a full A4 PDF screening report',
              ].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(14,165,233,.15)', border: '1px solid rgba(14,165,233,.35)' }}>
                    <Check size={10} className="text-sky-400" strokeWidth={3} />
                  </div>
                  <span className="text-slate-300 text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => onSelect('hr')}
                    className="inline-flex items-center gap-2.5 font-bold text-white px-7 py-3.5 rounded-2xl text-sm"
                    style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', boxShadow: '0 4px 20px rgba(14,165,233,.3)' }}>
              Enter HR Mode
              <ArrowRight size={16} />
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ── Choose mode ──────────────────────────────────────── */
function ChooseMode({ onSelect }) {
  const MODES = [
    {
      id: 'candidate',
      Icon: Users,
      label: 'Candidate Mode',
      badge: 'For Job Seekers',
      desc: 'Optimize your resume, prep for interviews, and apply with confidence using 5 AI tools.',
      features: [
        'ATS score + keyword analysis',
        'AI chat with your resume',
        'Interview question generator',
        'Resume improvement suggestions',
        'AI resume rewrite + PDF',
      ],
      cta:      'Enter as Candidate',
      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      glow:     'rgba(99,102,241,.35)',
    },
    {
      id: 'hr',
      Icon: Building2,
      label: 'HR / Recruiter Mode',
      badge: 'For HR Teams',
      desc: 'Screen, rank, and shortlist your entire applicant pool against any job description.',
      features: [
        'Bulk upload 2–50 resumes',
        'JD-based skill match scoring',
        'Auto-ranked candidate list',
        'Save and restore sessions',
        'PDF screening report',
      ],
      cta:      'Enter as Recruiter',
      gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
      glow:     'rgba(14,165,233,.35)',
    },
  ]

  return (
    <section id="choose" className="py-24" style={{ background: '#030712' }}>
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn className="text-center mb-14">
          <span className="inline-block text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 mb-5">
            Get Started
          </span>
          <h2 className="font-display font-black text-white mb-3"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
            Who are you here as?
          </h2>
          <p className="text-slate-400 text-base">Select your role and get the right set of tools. You can switch anytime.</p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {MODES.map(({ id, Icon, label, badge, desc, features, cta, gradient, glow }, i) => (
            <FadeIn key={id} delay={i * 120}>
              <div className="landing-mode-card rounded-3xl p-8 flex flex-col gap-6 cursor-pointer group h-full"
                   style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)' }}
                   onClick={() => onSelect(id)}
                   role="button" tabIndex={0}
                   onKeyDown={e => e.key === 'Enter' && onSelect(id)}>
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                       style={{ background: gradient, boxShadow: `0 0 24px ${glow}` }}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-slate-300"
                        style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.11)' }}>
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-xl mb-2">{label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                           style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.15)' }}>
                        <Check size={8} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-xs text-slate-300 leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 group-hover:scale-[1.02]"
                        style={{ background: gradient, boxShadow: `0 4px 20px ${glow}` }}>
                  {cta} →
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA banner ───────────────────────────────────────── */
function CTABanner({ onSelect }) {
  return (
    <section className="py-24" style={{ background: '#07091a' }}>
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="rounded-3xl p-14 md:p-20 relative overflow-hidden text-center"
               style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.14) 0%, rgba(124,58,237,.1) 100%)', border: '1px solid rgba(99,102,241,.22)' }}>
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,.18) 0%, transparent 58%)' }} />
            <div className="relative">
              <h2 className="font-display font-black text-white mb-4"
                  style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}>
                Ready to work smarter?
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-10 mx-auto" style={{ maxWidth: 420 }}>
                Join candidates and recruiters who are moving faster and making better decisions with AI.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button onClick={() => onSelect('candidate')}
                        className="btn-primary inline-flex items-center gap-2.5 font-bold text-white px-8 py-4 rounded-2xl text-base">
                  Start for Free
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => onSelect('hr')}
                        className="inline-flex items-center gap-2.5 font-semibold text-slate-300 hover:text-white px-8 py-4 rounded-2xl text-base transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                  Screen Candidates
                  <Clock size={16} />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────── */
function Footer({ onSelect, onShowLogin }) {
  return (
    <footer style={{ background: '#030712', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                   style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                ✦
              </div>
              <span className="text-white font-bold text-sm font-display">
                Recruitment<span className="text-indigo-400"> AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered tools for candidates and HR teams. Analyze, improve, and generate resumes in seconds.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16 flex-wrap">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Product</p>
              <ul className="space-y-3">
                {[
                  { label: 'For Candidates', action: () => onSelect('candidate') },
                  { label: 'For HR Teams',   action: () => onSelect('hr')        },
                  { label: 'How It Works',   action: null, href: '#how'          },
                  { label: 'Features',       action: null, href: '#features'     },
                ].map(({ label, action, href }) => (
                  <li key={label}>
                    {action
                      ? <button onClick={action} className="text-sm text-slate-500 hover:text-white transition-colors">{label}</button>
                      : <a href={href} className="text-sm text-slate-500 hover:text-white transition-colors">{label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Account</p>
              <ul className="space-y-3">
                {['Sign In', 'Register'].map(l => (
                  <li key={l}>
                    <button onClick={onShowLogin} className="text-sm text-slate-500 hover:text-white transition-colors">{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
             style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <p className="text-xs text-slate-600">© 2025 Recruitment AI · Powered by Groq LLaMA 3.3 70B</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Page root ────────────────────────────────────────── */
export default function LandingPage({ onSelect, onShowLogin }) {
  return (
    <div style={{ background: '#030712' }}>
      <LandingNav onSelect={onSelect} onShowLogin={onShowLogin} />
      <Hero         onSelect={onSelect} />
      <StatsStrip />
      <Features />
      <HowItWorks   onSelect={onSelect} />
      <ForCandidates onSelect={onSelect} />
      <ForHR        onSelect={onSelect} />
      <ChooseMode   onSelect={onSelect} />
      <CTABanner    onSelect={onSelect} />
      <Footer       onSelect={onSelect} onShowLogin={onShowLogin} />
    </div>
  )
}
