import { useState, useRef, useEffect } from 'react'
import { Users, Building2, LayoutGrid, History, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MODES = [
  { id: 'candidate', Icon: Users,     label: 'Candidate' },
  { id: 'hr',        Icon: Building2, label: 'HR Mode'   },
]

export default function NavBar({ mode, onModeChange, onShowLogin, onShowHistory }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16"
            style={{ background: 'rgba(3,7,18,.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => onModeChange(null)} className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200 group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,.4)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight font-display">
            Recruitment<span className="text-indigo-400"> AI</span>
          </span>
        </button>

        {/* Center nav — candidate mode */}
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

        {/* Center — HR mode label */}
        {mode === 'hr' && (
          <div className="hidden md:flex flex-1 justify-center">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
              HR / Recruiter Mode
            </span>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">

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

          {/* Switch mode button */}
          <button
            onClick={() => onModeChange(null)}
            title="Switch mode"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-white/10"
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">Switch</span>
          </button>

          {/* History button (only when logged in) */}
          {user && (
            <button
              onClick={onShowHistory}
              title="History"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-150 px-3 py-2 rounded-xl hover:bg-white/10"
            >
              <History size={14} />
              <span className="hidden sm:inline">History</span>
            </button>
          )}

          {/* Auth area */}
          {user ? (
            /* User avatar + dropdown */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white select-none"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  {initials}
                </div>
                <span className="hidden sm:block text-xs font-semibold text-slate-300 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,.15)' }}
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); onShowHistory() }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <History size={14} />
                    My History
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); logout() }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-slate-100"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login button */
            <button
              onClick={onShowLogin}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-xl transition-all"
              style={{ background: 'rgba(99,102,241,.25)', border: '1px solid rgba(99,102,241,.4)' }}
            >
              <User size={13} />
              Sign In
            </button>
          )}

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
