import { useState, useEffect } from 'react'
import { X, RefreshCw, FileText, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const fmt = iso => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const scoreColor = s => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'

function AnalysisCard({ item }) {
  const color = scoreColor(item.score)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-indigo-200 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">
            {item.filename || 'Unnamed Resume'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{fmt(item.created_at)}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-xl font-black leading-none" style={{ color }}>{item.score}</div>
          <div className="text-[10px] text-slate-400">/100</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          item.selected
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          {item.selected ? '✓ Selected' : '✗ Not Selected'}
        </span>
        <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {item.mode}
        </span>
        <span className="text-[10px] text-slate-400 ml-auto">
          {item.strengths?.length ?? 0} matched / {item.total_skills ?? 0} skills
        </span>
      </div>
    </div>
  )
}

function HRSessionCard({ item, onLoad }) {
  const total     = item.results?.total ?? 0
  const shortlist = item.results?.top_n  ?? 0
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-indigo-200 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{fmt(item.created_at)}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
            {total} screened
          </span>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Top {shortlist}
          </span>
        </div>
      </div>
      <button
        onClick={() => onLoad(item)}
        className="w-full py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:text-white hover:bg-indigo-500 border border-indigo-200 hover:border-indigo-500 transition-all duration-150"
      >
        Restore Session →
      </button>
    </div>
  )
}

export default function HistoryPanel({ onClose, onRestoreHR }) {
  const { authFetch } = useAuth()
  const [tab,         setTab]         = useState('analyses')
  const [analyses,    setAnalyses]    = useState([])
  const [sessions,    setSessions]    = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)

  const loadAnalyses = async () => {
    setLoading(true); setError(null)
    try {
      const res = await authFetch('/api/history/analyses')
      if (!res.ok) throw new Error('Failed to load history')
      setAnalyses(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const loadSessions = async () => {
    setLoading(true); setError(null)
    try {
      const res = await authFetch('/api/history/hr-sessions')
      if (!res.ok) throw new Error('Failed to load sessions')
      setSessions(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'analyses') loadAnalyses()
    else loadSessions()
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRestoreHR = item => {
    onRestoreHR(item.results, item.name)
    onClose()
  }

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white h-full w-full max-w-md flex flex-col shadow-2xl animate-slideIn">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <span className="text-white text-sm">⏱</span>
            </div>
            <h2 className="font-black text-slate-900 font-display">History</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => tab === 'analyses' ? loadAnalyses() : loadSessions()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="flex border-b border-slate-100 flex-shrink-0">
          {[
            { id: 'analyses', icon: FileText, label: 'My Analyses' },
            { id: 'sessions', icon: Users,    label: 'HR Sessions' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors duration-150',
                tab === id
                  ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/40'
                  : 'text-slate-400 hover:text-slate-700',
              ].join(' ')}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <span className="w-6 h-6 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
              {error}
            </div>
          )}

          {!loading && !error && tab === 'analyses' && (
            analyses.length === 0
              ? <EmptyHistoryState icon="📊" text="No analyses yet. Upload a resume to get started." />
              : analyses.map(item => <AnalysisCard key={item.id} item={item} />)
          )}

          {!loading && !error && tab === 'sessions' && (
            sessions.length === 0
              ? <EmptyHistoryState icon="🏆" text="No HR sessions yet. Screen resumes in HR Mode to save sessions." />
              : sessions.map(item => (
                  <HRSessionCard key={item.id} item={item} onLoad={handleRestoreHR} />
                ))
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyHistoryState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{text}</p>
    </div>
  )
}
