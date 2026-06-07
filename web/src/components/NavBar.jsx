import { Users, Building2, LayoutGrid } from 'lucide-react'

const MODES = [
  { id: 'candidate', Icon: Users,     label: 'Candidate' },
  { id: 'hr',        Icon: Building2, label: 'HR Mode'   },
]

export default function NavBar({ mode, onModeChange }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16"
            style={{ background: 'rgba(3,7,18,.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* Logo — click to go back to mode selector */}
        <button onClick={() => onModeChange(null)} className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200 group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,.4)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight font-display">
            Recruitment<span className="text-indigo-400"> AI</span>
          </span>
        </button>

        {/* Nav links — candidate mode only */}
        {mode === 'candidate' && (
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {[
              { label: 'Features',     href: '#features' },
              { label: 'How it works', href: '#tool'     },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                 className="nav-link text-sm text-slate-400 hover:text-white transition-colors duration-150 font-medium">
                {label}
              </a>
            ))}
          </nav>
        )}

        {/* HR mode center label */}
        {mode === 'hr' && (
          <div className="hidden md:flex flex-1 justify-center">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              HR / Recruiter Mode
            </span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* Mode switcher pills */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl p-1"
               style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)' }}>
            {MODES.map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => onModeChange(id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
                  mode === id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-white',
                ].join(' ')}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Change mode button (mobile + desktop) */}
          <button
            onClick={() => onModeChange(null)}
            title="Switch mode"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-white/10"
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">Switch</span>
          </button>

          {/* CTA */}
          {mode === 'candidate' && (
            <a href="#tool"
               className="btn-primary hidden md:inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl">
              Get Started
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
