import { useState } from 'react'
import { EmptyState, PrimaryButton, ResultCard, SectionTitle, ErrorBanner } from '../shared'

export default function GenerateTab({ resumeFile, jdFile }) {
  const [jobRole,    setJobRole]    = useState('')
  const [useJD,      setUseJD]      = useState(false)
  const [result,     setResult]     = useState('')
  const [loading,    setLoading]    = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [error,      setError]      = useState(null)

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

  const downloadPDF = async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      const res = await fetch('/api/pdf/resume', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ markdown: result }),
      })
      if (!res.ok) throw new Error('PDF generation failed')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), {
        href:     url,
        download: `${jobRole.trim().replace(/\s+/g, '_')}_resume.pdf`,
      })
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setPdfLoading(false)
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
          {/* Preview */}
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>

          {/* Download actions */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={downloadPDF}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all active:scale-[.99] disabled:opacity-60"
              style={{
                background: pdfLoading
                  ? '#94a3b8'
                  : 'linear-gradient(135deg,#6366f1,#7c3aed)',
                boxShadow: pdfLoading ? 'none' : '0 4px 14px rgba(99,102,241,.3)',
              }}
            >
              {pdfLoading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Generating PDF…</>
                : <>📄 Download PDF Resume</>
              }
            </button>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
