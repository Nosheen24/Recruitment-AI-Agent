import { useState, useEffect } from 'react'
import { EmptyState, PrimaryButton, ErrorBanner, SectionTitle } from '../shared'

/* ── count-up hook ──────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const n = Number(target) || 0
    if (n === 0) { setCount(0); return }
    let startTime = null
    let raf
    const animate = ts => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * n))
      if (progress < 1) { raf = requestAnimationFrame(animate) }
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

/* ── SVG circular progress ring for ATS score ────────── */
function ScoreRing({ value, passed }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const [strokeProgress, setStrokeProgress] = useState(0)
  const count = useCountUp(value)

  useEffect(() => {
    const t = setTimeout(() => setStrokeProgress(value), 80)
    return () => clearTimeout(t)
  }, [value])

  const dashOffset = circ * (1 - strokeProgress / 100)
  const strokeColor = passed ? '#10b981' : '#ef4444'
  const textColor   = passed ? 'text-emerald-600' : 'text-red-500'
  const ringBg      = passed ? '#d1fae5' : '#fee2e2'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative mx-auto mb-3" style={{ width: 96, height: 96 }}>
        {/* glow ring behind */}
        <div className="absolute inset-0 rounded-full opacity-30"
             style={{ background: `radial-gradient(circle, ${ringBg} 0%, transparent 70%)` }} />
        <svg width="96" height="96" viewBox="0 0 100 100"
             style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
          <circle
            cx="50" cy="50" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)', filter: `drop-shadow(0 0 4px ${strokeColor}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black leading-none ${textColor}`}>{count}</span>
          <span className="text-[10px] text-slate-400 font-semibold">/100</span>
        </div>
      </div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">ATS Score</div>
    </div>
  )
}

/* ── Count metric card (skills matched / missing) ────── */
function MetricCard({ value, label, variant }) {
  const count = useCountUp(value, 900)
  const styles = {
    emerald: { num: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    red:     { num: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200'     },
  }
  const s = styles[variant]
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className={`w-16 h-16 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center mx-auto mb-3`}>
        <span className={`text-3xl font-black leading-none ${s.num}`}>{count}</span>
      </div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
  )
}

/* ── skill group ─────────────────────────────────────── */
function SkillGroup({ title, skills, variant }) {
  const tag = variant === 'ok'
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
    : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-bold text-slate-700 mb-3">{title}</p>
      {skills.length > 0
        ? <div className="flex flex-wrap gap-1.5">
            {skills.map(s => (
              <span key={s} className={`text-xs font-semibold px-3 py-1 rounded-full border cursor-default transition-colors ${tag}`}>{s}</span>
            ))}
          </div>
        : <p className="text-xs text-slate-400 italic">
            {variant === 'ok' ? 'None found.' : 'All skills matched 🎉'}
          </p>
      }
    </div>
  )
}

/* ── results panel ─────────────────────────────────── */
function Results({ result, onReset }) {
  const { score, selected, strengths = [], weaknesses = [] } = result
  const passed   = selected
  const barColor = passed ? '#10b981' : '#ef4444'

  return (
    <div className="animate-fadeIn space-y-5">

      {/* stat cards — ring for ATS, metric for counts */}
      <div className="grid grid-cols-3 gap-4">
        <ScoreRing value={score} passed={passed} />
        <MetricCard value={strengths.length}  label="Skills Matched" variant="emerald" />
        <MetricCard value={weaknesses.length} label="Skills Missing"  variant="red"    />
      </div>

      {/* verdict banner */}
      <div className={`flex items-center gap-3.5 p-4 rounded-2xl border ${passed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
        <span className="text-2xl">{passed ? '✅' : '❌'}</span>
        <div>
          <p className={`font-bold text-sm ${passed ? 'text-emerald-900' : 'text-red-900'}`}>
            {passed ? 'SELECTED — Meets the cutoff threshold' : 'NOT SELECTED — Below the cutoff threshold'}
          </p>
          <p className={`text-xs mt-0.5 ${passed ? 'text-emerald-700' : 'text-red-700'}`}>
            Score {score}/100 {passed ? 'exceeds' : 'is below'} the required 75/100 minimum
          </p>
        </div>
      </div>

      {/* progress bar */}
      <div>
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-slate-600">ATS Compatibility Score</span>
          <span style={{ color: barColor }} className="font-bold">{score}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${score}%`,
              background: passed
                ? 'linear-gradient(90deg,#34d399,#10b981)'
                : 'linear-gradient(90deg,#f87171,#ef4444)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>0</span><span>▲ Cutoff: 75</span><span>100</span>
        </div>
      </div>

      {/* skill tags */}
      <div className="grid grid-cols-2 gap-4">
        <SkillGroup title="✅ Matched Skills" skills={strengths}  variant="ok" />
        <SkillGroup title="❌ Missing Skills" skills={weaknesses} variant="no" />
      </div>

      {/* re-analyze */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-semibold transition-colors pt-1"
      >
        🔄 Re-analyze
      </button>
    </div>
  )
}

/* ── main tab ────────────────────────────────────────── */
export default function AnalysisTab({ resumeFile, jdFile, analysisResult, setAnalysisResult }) {
  const [mode,    setMode]    = useState('ats')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  if (!resumeFile) {
    return (
      <EmptyState
        icon="📄"
        title="Upload a resume to begin"
        text="Drop your PDF or TXT resume in the sidebar. The AI will score it for ATS compatibility and extract your key skills."
      />
    )
  }

  const handleAnalyze = async () => {
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      if (jdFile) fd.append('jd', jdFile)
      fd.append('mode', mode)
      const res = await fetch('/api/analyze', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      setAnalysisResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>📊 Resume Analysis</SectionTitle>

      {/* mode toggle */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
          {[
            { id: 'ats', label: 'ATS Keywords'    },
            { id: 'jd',  label: 'Job Description' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              disabled={id === 'jd' && !jdFile}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150',
                mode === id
                  ? 'text-white shadow-sm'
                  : id === 'jd' && !jdFile
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100',
              ].join(' ')}
              style={mode === id ? { background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 2px 10px rgba(99,102,241,.3)' } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === 'jd' && !jdFile && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 font-medium">
            ⚠️ Upload a Job Description in the sidebar first
          </p>
        )}
      </div>

      <PrimaryButton onClick={handleAnalyze} loading={loading}>🔍 Analyze Resume</PrimaryButton>

      {error && <ErrorBanner message={error} />}

      {analysisResult && !loading && (
        <div className="mt-5">
          <Results result={analysisResult} onReset={() => setAnalysisResult(null)} />
        </div>
      )}
    </div>
  )
}
