import { Brain, BarChart2, FileText, Zap } from 'lucide-react'

/* ── Feature pill ─────────────────────────────────── */
function FeaturePill({ icon, label }) {
  return (
    <div className="flex items-center gap-2 glass rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/10 cursor-default">
      <span className="text-base">{icon}</span>
      <span className="text-xs font-semibold text-slate-300">{label}</span>
    </div>
  )
}

/* ── Glassmorphism stat card ──────────────────────── */
function StatCard({ value, label, Icon, iconColor }) {
  return (
    <div className="glass-stat rounded-2xl px-5 py-5 flex-1 min-w-[130px] cursor-default">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconColor}`}
           style={{ background: 'rgba(255,255,255,.08)' }}>
        <Icon size={18} />
      </div>
      <div className="text-2xl font-black text-white font-display leading-none mb-1">{value}</div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  )
}

/* ── Main hero ────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="hero-bg min-h-screen flex flex-col justify-center pt-16 pb-24 relative">

      {/* grid + noise */}
      <div className="hero-grid" />
      <div className="hero-noise" />

      {/* glowing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* top-right indigo blob */}
        <div className="absolute -top-32 -right-32 w-[750px] h-[750px] rounded-full animate-orbPulse"
             style={{
               background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,.35) 0%, rgba(99,102,241,.1) 40%, transparent 68%)',
               filter: 'blur(48px)',
             }} />
        {/* bottom-left violet blob */}
        <div className="absolute -bottom-48 -left-48 w-[650px] h-[650px] rounded-full animate-orbPulse"
             style={{
               background: 'radial-gradient(circle at 65% 65%, rgba(124,58,237,.32) 0%, rgba(124,58,237,.08) 40%, transparent 68%)',
               filter: 'blur(56px)',
               animationDelay: '4s',
             }} />
        {/* center subtle blue accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-orbPulse"
             style={{
               background: 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 62%)',
               filter: 'blur(40px)',
               animationDelay: '8s',
             }} />
        {/* top-left tiny accent */}
        <div className="absolute top-20 left-20 w-[200px] h-[200px] rounded-full"
             style={{
               background: 'radial-gradient(circle, rgba(167,139,250,.18) 0%, transparent 60%)',
               filter: 'blur(30px)',
             }} />
      </div>

      {/* content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

        {/* badge */}
        <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">
            AI-Powered Resume Platform
          </span>
        </div>

        {/* heading */}
        <h1 className="font-display font-black text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5rem)' }}>
          Land Your Dream Job
          <br />
          <span className="gradient-text">Faster Than Ever</span>
        </h1>

        {/* subheading */}
        <p className="text-slate-400 leading-relaxed mb-10 mx-auto font-medium"
           style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '540px' }}>
          Analyze your resume in seconds. Score your ATS compatibility,
          generate interview questions, and create an optimized resume — powered by advanced AI.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 mb-14 flex-wrap">
          <a href="#tool"
             className="btn-primary inline-flex items-center gap-2.5 font-bold text-white px-7 py-3.5 rounded-2xl text-sm">
            Start Analyzing Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#features"
             className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 px-5 py-3.5">
            See what it does
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* glassmorphism stat cards */}
        <div className="flex gap-4 justify-center flex-wrap">
          <StatCard value="5"    label="AI Tools"       Icon={Brain}     iconColor="text-indigo-400" />
          <StatCard value="ATS"  label="Score Analysis" Icon={BarChart2} iconColor="text-violet-400" />
          <StatCard value="∞"    label="Resumes"        Icon={FileText}  iconColor="text-blue-400"   />
          <StatCard value="Live" label="Results"        Icon={Zap}       iconColor="text-cyan-400"   />
        </div>

        {/* feature pills */}
        <div className="flex gap-3 justify-center flex-wrap mt-8">
          <FeaturePill icon="📊" label="Resume Analysis"      />
          <FeaturePill icon="💬" label="AI Chat"               />
          <FeaturePill icon="❓" label="Interview Questions"   />
          <FeaturePill icon="💡" label="Improvement Tips"      />
          <FeaturePill icon="✨" label="Resume Generator"      />
        </div>
      </div>

      {/* scroll hint */}
      <div className="scroll-hint flex flex-col items-center gap-1.5">
        <span className="text-xs text-slate-600 font-medium uppercase tracking-widest">Scroll</span>
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
