import { useState } from 'react'
import { EmptyState, PrimaryButton, ResultCard, SectionTitle, ErrorBanner } from '../shared'

const ALL_SECTIONS = ['Skills', 'Projects', 'Experience', 'Achievements', 'Overall Structure']

export default function ImprovementsTab({ resumeFile }) {
  const [selected, setSelected] = useState(['Skills', 'Overall Structure'])
  const [result,   setResult]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  if (!resumeFile) {
    return (
      <EmptyState
        icon="💡"
        title="No resume uploaded"
        text="Upload a resume to get AI-powered improvement suggestions for every section."
      />
    )
  }

  const toggle = s => setSelected(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])

  const generate = async () => {
    if (!selected.length) return
    setLoading(true); setError(null); setResult('')
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      fd.append('sections', JSON.stringify(selected))
      const res = await fetch('/api/improvements', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const { suggestions } = await res.json()
      setResult(suggestions)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>💡 Resume Improvement Suggestions</SectionTitle>

      <div className="mb-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select sections to improve</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => toggle(s)}
              className={[
                'px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150',
                selected.includes(s)
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700',
              ].join(' ')}
              style={selected.includes(s) ? { boxShadow: '0 3px 12px rgba(99,102,241,.28)' } : undefined}
            >
              {s}
            </button>
          ))}
        </div>
        {selected.length === 0 && (
          <p className="text-xs text-amber-600 mt-2">Select at least one section.</p>
        )}
      </div>

      <PrimaryButton onClick={generate} loading={loading} disabled={selected.length === 0}>
        💡 Get Suggestions
      </PrimaryButton>

      {error  && <ErrorBanner message={error} />}

      {result && (
        <ResultCard>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
        </ResultCard>
      )}
    </div>
  )
}
