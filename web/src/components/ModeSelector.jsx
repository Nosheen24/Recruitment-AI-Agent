import { Users, Building2, Check } from 'lucide-react'

const MODES = [
  {
    id: 'candidate',
    Icon: Users,
    iconGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    iconGlow: 'rgba(99,102,241,.45)',
    title: 'Candidate Mode',
    description: 'Optimize your resume and prepare for interviews with AI-powered tools.',
    features: [
      'ATS score analysis against any job posting',
      'AI chat — ask anything about your resume',
      'Tailored interview question generator',
      'Smart improvement suggestions',
      'AI-powered resume rewriter',
    ],
    cta: 'Enter as Candidate',
    badge: 'For Job Seekers',
    badgeStyle: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  },
  {
    id: 'hr',
    Icon: Building2,
    iconGradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
    iconGlow: 'rgba(14,165,233,.45)',
    title: 'HR / Recruiter Mode',
    description: 'Screen, rank, and shortlist dozens of candidates against a job description in one click.',
    features: [
      'Bulk upload 2–50 resumes at once',
      'JD-based skill match scoring',
      'Auto-rank by job fit percentage',
      'Shortlist top-N candidates instantly',
      'Download full CSV screening report',
    ],
    cta: 'Enter as Recruiter',
    badge: 'For HR Teams',
    badgeStyle: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
  },
]

function ModeCard({ mode, onSelect }) {
  const { id, Icon, iconGradient, iconGlow, title, description, features, cta, badge, badgeStyle } = mode
  return (
    <div
      className="glass-stat rounded-3xl p-8 flex flex-col gap-6 cursor-pointer group"
      style={{ minHeight: 460 }}
      onClick={() => onSelect(id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(id)}
    >
      {/* top row */}
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: iconGradient, boxShadow: `0 0 24px ${iconGlow}` }}>
          <Icon size={26} className="text-white" />
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeStyle}`}>{badge}</span>
      </div>

      {/* text */}
      <div>
        <h2 className="font-display font-black text-white text-2xl mb-2 leading-tight">{title}</h2>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      {/* features */}
      <ul className="space-y-2.5 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mt-0.5 flex-shrink-0">
              <Check size={9} className="text-emerald-400" strokeWidth={3} />
            </div>
            <span className="text-xs text-slate-300 leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-2xl"
        style={{ background: iconGradient, boxShadow: `0 4px 20px ${iconGlow}` }}
      >
        {cta} →
      </button>
    </div>
  )
}

export default function ModeSelector({ onSelect }) {
  return (
    <div className="hero-bg min-h-screen flex flex-col relative">
      <div className="hero-grid" />
      <div className="hero-noise" />

      {/* ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle at 35% 35%, rgba(99,102,241,.3) 0%, transparent 65%)', filter: 'blur(48px)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full"
             style={{ background: 'radial-gradient(circle at 65% 65%, rgba(14,165,233,.2) 0%, transparent 65%)', filter: 'blur(56px)' }} />
      </div>

      {/* minimal header */}
      <header className="relative z-10 h-16 flex items-center px-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,.4)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight font-display">
            Recruitment<span className="text-indigo-400"> AI</span>
          </span>
        </div>
      </header>

      {/* centered content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto w-full">

          {/* heading */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">
                Choose Your Mode
              </span>
            </div>
            <h1 className="font-display font-black text-white leading-[1.1] tracking-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Who are you here as?
            </h1>
            <p className="text-slate-400 text-base mx-auto leading-relaxed" style={{ maxWidth: 440 }}>
              Select your role to get the right set of tools. You can switch anytime.
            </p>
          </div>

          {/* mode cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {MODES.map(m => <ModeCard key={m.id} mode={m} onSelect={onSelect} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
