import { useState } from 'react'
import { EmptyState, PrimaryButton, ResultCard, SectionTitle, ErrorBanner } from '../shared'

export default function GenerateTab({ resumeFile, jdFile }) {
  const [jobRole, setJobRole] = useState('')
  const [useJD,   setUseJD]   = useState(false)
  const [result,  setResult]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  if (!resumeFile) {
    return (
      <EmptyState
        icon="✨"
        title="No resume uploaded"
        text="Upload your resume and enter a target job role. The AI will generate an ATS-optimised, professionally rewritten version."
      />
    )
  }

  const generate = async () => {
    if (!jobRole.trim()) return
    setLoading(true); setError(null); setResult('')
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      fd.append('job_role', jobRole.trim())
      if (useJD && jdFile) fd.append('jd', jdFile)
      const res = await fetch('/api/generate', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const { improved_resume } = await res.json()
      setResult(improved_resume)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>✨ Generate Improved Resume</SectionTitle>

      {/* inputs row */}
      <div className="flex gap-3 mb-5">
        <input
          value={jobRole}
          onChange={e => setJobRole(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Target role — e.g. Data Scientist · Backend Engineer · AI Engineer"
          className="flex-1 border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm"
        />
        <label className={[
          'flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 cursor-pointer shadow-sm text-sm font-semibold transition-all select-none',
          jdFile
            ? 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
            : 'border-slate-100 text-slate-300 cursor-not-allowed',
        ].join(' ')}>
          <input
            type="checkbox"
            checked={useJD}
            onChange={e => setUseJD(e.target.checked)}
            disabled={!jdFile}
            className="accent-indigo-500"
          />
          Tailor to JD
        </label>
      </div>

      {!jdFile && useJD && (
        <p className="text-xs text-amber-600 mb-3">Upload a JD in the sidebar to tailor the resume.</p>
      )}

      <PrimaryButton onClick={generate} loading={loading} disabled={!jobRole.trim()}>
        ✨ Generate Improved Resume
      </PrimaryButton>

      {error && <ErrorBanner message={error} />}

      {result && (
        <ResultCard>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
            <a
              href={`data:text/markdown;charset=utf-8,${encodeURIComponent(result)}`}
              download="improved_resume.md"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              📥 Markdown
            </a>
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(result)}`}
              download="improved_resume.txt"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              📥 Plain Text
            </a>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
