import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Download, Users, Trophy, FileText } from 'lucide-react'
import { ErrorBanner, Spinner, GateBanner } from './shared'
import { useAuth } from '../context/AuthContext'
import { useGuestLimit } from '../hooks/useGuestLimit'

/* ── helpers ─────────────────────────────────────────── */
const cleanName = filename => filename.replace(/\.(pdf|txt)$/i, '')

const rankStyle = rank => {
  if (rank === 1) return { bg: 'bg-amber-400',  text: 'text-white', shadow: 'rgba(251,191,36,.5)' }
  if (rank === 2) return { bg: 'bg-slate-400',   text: 'text-white', shadow: 'rgba(148,163,184,.5)' }
  if (rank === 3) return { bg: 'bg-orange-400',  text: 'text-white', shadow: 'rgba(251,146,60,.5)' }
  return               { bg: 'bg-indigo-500',  text: 'text-white', shadow: 'rgba(99,102,241,.4)'  }
}

const scoreColor = score =>
  score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

/* ── multi-file upload zone ───────────────────────────── */
function MultiUploadZone({ files, onFiles }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const addFiles = useCallback(incoming => {
    const valid = Array.from(incoming).filter(
      f => f.type === 'application/pdf' || f.name?.endsWith('.txt')
    )
    onFiles(prev => {
      const merged = [...prev, ...valid]
      const deduped = merged.filter((f, i) => merged.findIndex(x => x.name === f.name && x.size === f.size) === i)
      return deduped.slice(0, 50)
    })
  }, [onFiles])

  const handleDrop = e => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const removeFile = idx => onFiles(prev => prev.filter((_, i) => i !== idx))

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'dropzone rounded-xl border-2 border-dashed p-5 text-center cursor-pointer',
          dragging
            ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
            : files.length > 0
            ? 'border-indigo-300 bg-indigo-50/60'
            : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 bg-slate-50/60',
        ].join(' ')}
      >
        <input ref={inputRef} type="file" accept=".pdf,.txt" multiple className="hidden"
               onChange={e => { addFiles(e.target.files); e.target.value = '' }} />

        {files.length > 0 ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-indigo-700">
                {files.length} resume{files.length !== 1 ? 's' : ''} uploaded
              </p>
              <p className="text-xs text-slate-400">Drop more or click to add (max 50)</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Upload size={16} className="text-slate-400" />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Drop resumes or <span className="text-indigo-500">click to browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">PDF or TXT · 2–50 files</p>
          </div>
        )}
      </div>

      {/* file list */}
      {files.length > 0 && (
        <div className="mt-2 max-h-36 overflow-y-auto space-y-1 pr-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-slate-100 group">
              <span className="text-xs font-medium text-slate-700 truncate flex-1">{f.name}</span>
              <span className="text-xs text-slate-400 flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
              <button onClick={e => { e.stopPropagation(); removeFile(i) }}
                      className="text-slate-300 hover:text-red-500 transition-colors ml-1 flex-shrink-0">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button onClick={() => onFiles([])}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1 font-medium flex items-center gap-1">
          <X size={11} /> Clear all
        </button>
      )}
    </div>
  )
}

/* ── HR sidebar panel ─────────────────────────────────── */
function HRSidebar({ files, onFiles, jdText, onJd, topN, onTopN, onScreen, loading }) {
  const canScreen = files.length >= 2 && jdText.trim().length > 20 && !loading

  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
             style={{ boxShadow: '0 8px 40px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04)' }}>

          {/* header */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
                <Users size={15} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Screening Setup</h3>
                <p className="text-xs text-slate-400">Configure and run bulk screening</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">

            {/* step 1: resumes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  1 · Resumes
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  files.length >= 2
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {files.length < 2 ? `Min 2 required` : `${files.length} ready`}
                </span>
              </div>
              <MultiUploadZone files={files} onFiles={onFiles} />
            </div>

            <div className="border-t border-slate-100" />

            {/* step 2: JD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  2 · Job Description
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  jdText.trim().length > 20
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  {jdText.trim().length > 20 ? 'Provided' : 'Required'}
                </span>
              </div>
              <textarea
                value={jdText}
                onChange={e => onJd(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={5}
                className="w-full text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/60 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-150 placeholder-slate-400 leading-relaxed"
              />
            </div>

            <div className="border-t border-slate-100" />

            {/* step 3: top-N */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-widest block mb-3">
                3 · Shortlist Top N
              </span>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">How many top candidates?</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onTopN(n => Math.max(1, n - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                  >−</button>
                  <span className="text-lg font-black text-slate-900 w-6 text-center">{topN}</span>
                  <button
                    onClick={() => onTopN(n => Math.min(Math.max(files.length, 20), n + 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center transition-colors"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          {/* screen button */}
          <div className="px-5 pb-5">
            <button
              onClick={onScreen}
              disabled={!canScreen}
              className="btn-primary w-full flex items-center justify-center gap-2.5 text-white font-bold text-sm rounded-xl py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <><Spinner /><span>Screening {files.length} resumes…</span></>
              ) : (
                <><Users size={16} /><span>Screen All Resumes</span></>
              )}
            </button>
            {!canScreen && !loading && (
              <p className="text-[11px] text-slate-400 text-center mt-2">
                {files.length < 2 ? 'Upload at least 2 resumes' : 'Add a job description to continue'}
              </p>
            )}
          </div>
        </div>

        {/* tip */}
        <div className="rounded-2xl p-4"
             style={{ background: 'linear-gradient(135deg,rgba(14,165,233,.08),rgba(99,102,241,.06))', border: '1px solid rgba(14,165,233,.15)' }}>
          <p className="text-xs font-bold text-sky-700 mb-1">💡 Tip</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Include the full JD (requirements, skills, responsibilities) for the most accurate scoring.
          </p>
        </div>
      </div>
    </aside>
  )
}

/* ── loading panel ────────────────────────────────────── */
function LoadingPanel({ count }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center"
         style={{ boxShadow: '0 8px 40px rgba(0,0,0,.07)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
           style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1)' }}>
        <Spinner />
      </div>
      <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Screening Resumes</h3>
      <p className="text-slate-500 text-sm">
        Analyzing {count} candidate{count !== 1 ? 's' : ''} against the job description…
      </p>
      <p className="text-xs text-slate-400 mt-2">This may take 30–60 seconds</p>
    </div>
  )
}

/* ── empty state ──────────────────────────────────────── */
function HREmptyState() {
  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 text-3xl">
        🏆
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-2">Results appear here</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
        Upload your candidate resumes, add a job description, and click <strong>Screen All Resumes</strong> to get a ranked shortlist.
      </p>
    </div>
  )
}

/* ── summary banner ───────────────────────────────────── */
function SummaryBanner({ total, topN, skillsAnalyzed, selected }) {
  const stats = [
    { value: total,         label: 'Screened',        color: 'text-slate-900'   },
    { value: skillsAnalyzed, label: 'Skills Analyzed', color: 'text-indigo-600'  },
    { value: topN,          label: 'Shortlisted',      color: 'text-emerald-600' },
    { value: selected,      label: 'Above Cutoff',     color: 'text-sky-600'     },
  ]
  return (
    <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6"
         style={{ boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
      {stats.map(s => (
        <div key={s.label} className="text-center">
          <div className={`text-2xl font-black font-display ${s.color}`}>{s.value}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ── top candidate card ───────────────────────────────── */
function TopCandidateCard({ rank, result }) {
  const { bg, text, shadow } = rankStyle(rank)
  const color = scoreColor(result.score)
  const name = cleanName(result.filename)
  const topSkills = result.strengths.slice(0, 4)
  const extra = result.strengths.length - topSkills.length

  return (
    <div className="bg-white rounded-2xl p-5 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
         style={{ borderColor: rank <= 3 ? 'rgba(99,102,241,.25)' : '#f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,.06)' }}>

      {/* rank + status */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-2xl ${bg} ${text} font-black text-base flex items-center justify-center`}
             style={{ boxShadow: `0 4px 14px ${shadow}` }}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : `#${rank}`}
        </div>
        {result.selected && (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            ✓ Shortlisted
          </span>
        )}
      </div>

      {/* name + score */}
      <div className="flex items-end justify-between mb-3">
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-sm truncate font-display" title={name}>{name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{result.strengths.length + result.weaknesses.length} skills evaluated</p>
        </div>
        <div className="flex-shrink-0 text-right ml-3">
          <div className="text-2xl font-black leading-none" style={{ color }}>{result.score}</div>
          <div className="text-[10px] text-slate-400">/100</div>
        </div>
      </div>

      {/* mini score bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700"
             style={{ width: `${result.score}%`, background: color }} />
      </div>

      {/* matched skills */}
      {topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {topSkills.map(s => (
            <span key={s} className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {extra > 0 && (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">+{extra}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── rankings table ───────────────────────────────────── */
function RankingsTable({ results, topN }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
         style={{ boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-5 py-3.5 w-14">#</th>
            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5">Candidate</th>
            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5 w-44">Score</th>
            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5 w-32">Status</th>
            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-3.5 w-24">Matched</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const rank = i + 1
            const isTop = rank <= topN
            const color = scoreColor(r.score)
            const { bg, text } = rankStyle(rank)
            return (
              <tr key={i}
                  className={`border-b border-slate-100 transition-colors ${isTop ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50/60'}`}>
                <td className="px-5 py-3.5">
                  <div className={`w-7 h-7 rounded-xl ${bg} ${text} text-xs font-black flex items-center justify-center`}>
                    {rank}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isTop ? 'text-indigo-800' : 'text-slate-800'} truncate max-w-[180px]`} title={cleanName(r.filename)}>
                      {cleanName(r.filename)}
                    </span>
                    {isTop && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                        Top {topN}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-base w-8" style={{ color }}>{r.score}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: color }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.selected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {r.selected ? '✓ Selected' : '✗ Not Selected'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-bold text-slate-700">
                    {r.strengths.length}
                    <span className="text-slate-400 font-normal">/{r.strengths.length + r.weaknesses.length}</span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── CSV download ─────────────────────────────────────── */
function downloadCSV(data) {
  const headers = ['Rank', 'Candidate', 'Score', 'Status', 'Matched Skills', 'Missing Skills']
  const rows = data.results.map((r, i) => [
    i + 1,
    cleanName(r.filename),
    r.score,
    r.selected ? 'SELECTED' : 'NOT SELECTED',
    r.strengths.join('; '),
    r.weaknesses.join('; '),
  ])
  const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'candidate_screening_report.csv' })
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}

async function downloadPDF(data) {
  const res = await fetch('/api/pdf/screening', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
  if (!res.ok) { alert('PDF generation failed'); return }
  const blob = await res.blob()
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'candidate_screening_report.pdf' })
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}

/* ── results panel ────────────────────────────────────── */
function ResultsPanel({ data }) {
  const { results, top_n: topN, total, skills_analyzed } = data
  const topCandidates  = results.slice(0, topN)
  const selectedCount  = results.filter(r => r.selected).length

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* summary */}
      <SummaryBanner
        total={total}
        topN={topN}
        skillsAnalyzed={skills_analyzed.length}
        selected={selectedCount}
      />

      {/* Download buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => downloadPDF(data)}
          className="inline-flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
          style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 14px rgba(99,102,241,.3)' }}
        >
          <Download size={15} />
          Download PDF Report
        </button>
        <button
          onClick={() => downloadCSV(data)}
          className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          <Download size={15} />
          CSV
        </button>
      </div>

      {/* top-N cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-amber-500" />
          <h2 className="font-display font-bold text-slate-900">Top {topN} Shortlisted Candidates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {topCandidates.map((r, i) => (
            <TopCandidateCard key={i} rank={i + 1} result={r} />
          ))}
        </div>
      </div>

      {/* full table */}
      <div>
        <h2 className="font-display font-bold text-slate-900 mb-4">All Candidates Ranked</h2>
        <RankingsTable results={results} topN={topN} />
      </div>
    </div>
  )
}

/* ── main HR mode page ────────────────────────────────── */
export default function HRMode({ restoredSession, onShowLogin }) {
  const { token, authFetch } = useAuth()
  const { isLimited, usesLeft, recordUse } = useGuestLimit()
  const [files,    setFiles]    = useState([])
  const [jdText,   setJdText]   = useState('')
  const [topN,     setTopN]     = useState(5)
  const [loading,  setLoading]  = useState(false)
  const [results,  setResults]  = useState(null)
  const [error,    setError]    = useState(null)
  const [savedMsg, setSavedMsg] = useState(null)
  const [showGate, setShowGate] = useState(false)

  // Restore a previous session when provided from history
  useEffect(() => {
    if (restoredSession) {
      setResults(restoredSession.results)
      if (restoredSession.results?.top_n) setTopN(restoredSession.results.top_n)
    }
  }, [restoredSession])

  const handleScreen = async () => {
    if (isLimited) { setShowGate(true); return }
    if (files.length < 2) { setError('Upload at least 2 resumes.'); return }
    if (!jdText.trim())   { setError('Paste a job description.'); return }
    setLoading(true); setError(null); setResults(null); setSavedMsg(null); setShowGate(false)
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('resumes', f))
      fd.append('jd_text', jdText)
      fd.append('top_n', String(topN))
      const fetchFn = token ? authFetch : fetch
      const res = await fetchFn('/api/screen', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResults(data)
      recordUse()
      if (token) setSavedMsg('Session saved to your history.')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>

      {/* page header */}
      <div className="pt-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                HR Mode
              </span>
            </div>
            <h1 className="font-display font-black text-slate-900 text-2xl">Bulk Resume Screening</h1>
            <p className="text-slate-500 text-sm mt-1">
              Upload multiple resumes, add a job description, and get an instant ranked shortlist.
            </p>
          </div>

          {/* live stats */}
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 font-display">{files.length}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Uploaded</div>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600 font-display">{topN}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Top N</div>
            </div>
            {results && <>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600 font-display">{results.total}</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Screened</div>
              </div>
            </>}
          </div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-6 py-10 dot-grid">
        <div className="flex gap-8 items-start">

          <HRSidebar
            files={files}   onFiles={setFiles}
            jdText={jdText} onJd={setJdText}
            topN={topN}     onTopN={setTopN}
            onScreen={handleScreen}
            loading={loading}
          />

          <div className="flex-1 min-w-0">
            {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
            {savedMsg && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                ✓ {savedMsg}
              </div>
            )}
            {restoredSession && results && !loading && (
              <div className="mb-4 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                📂 Restored session: <strong>{restoredSession.name}</strong>
              </div>
            )}
            {showGate  ? <GateBanner onShowLogin={onShowLogin} />
             : loading  ? <LoadingPanel count={files.length} />
             : results  ? <ResultsPanel data={results} />
             :             <>
                             <HREmptyState />
                             {usesLeft !== null && usesLeft > 0 && (
                               <p className="text-xs text-center text-slate-400 mt-4">
                                 {usesLeft} free {usesLeft === 1 ? 'screening' : 'screenings'} remaining —{' '}
                                 <button onClick={onShowLogin} className="text-indigo-500 hover:underline font-semibold">sign up for unlimited</button>
                               </p>
                             )}
                           </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
