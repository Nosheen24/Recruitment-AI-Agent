import { useState, useRef, useCallback } from 'react'
import { Upload, Check } from 'lucide-react'

/* ── Compact dropzone (no header, step-layout drives labels) ── */
function UploadZone({ file, onFile }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()
  const valid = f => f && (f.type === 'application/pdf' || f.name?.endsWith('.txt'))

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (valid(f)) onFile(f)
  }, [onFile])

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'dropzone rounded-xl border-2 border-dashed p-4 text-center cursor-pointer',
          dragging
            ? 'border-indigo-400 bg-indigo-50 scale-[1.01]'
            : file
            ? 'border-emerald-300 bg-emerald-50/70'
            : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 bg-slate-50/60',
        ].join(' ')}
      >
        <input
          ref={inputRef} type="file" accept=".pdf,.txt" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
        />
        {file ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">{file.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Upload size={13} className="text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-600">Drop or <span className="text-indigo-500">browse</span></p>
              <p className="text-xs text-slate-400">PDF or TXT</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={() => onFile(null)}
          className="w-full mt-1 text-xs text-slate-400 hover:text-red-500 transition-colors duration-150 py-0.5 font-medium text-left pl-1"
        >
          × Remove
        </button>
      )}
    </div>
  )
}

/* ── Step badge circle ─────────────────────────────── */
function StepBadge({ number, done, active }) {
  if (done) {
    return (
      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 transition-all duration-300">
        <Check size={14} className="text-white" strokeWidth={2.5} />
      </div>
    )
  }
  if (active) {
    return (
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white transition-all duration-300"
           style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 0 12px rgba(99,102,241,.4)' }}>
        {number}
      </div>
    )
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-400 transition-all duration-300">
      {number}
    </div>
  )
}

/* ── Main sidebar ─────────────────────────────────── */
export default function Sidebar({ resumeFile, setResumeFile, jdFile, setJdFile }) {
  const step1Done   = !!resumeFile
  const step2Done   = !!jdFile
  const step2Active = step1Done && !step2Done
  const connectorFull = step1Done && step2Done
  const connectorHalf = step1Done && !step2Done

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="sticky top-8 space-y-4">

        {/* Upload card */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden"
             style={{ boxShadow: '0 8px 40px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04)' }}>

          {/* card header */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                   style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                ✦
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Upload Files</h3>
                <p className="text-xs text-slate-400">Follow the steps below</p>
              </div>
            </div>
          </div>

          {/* step flow */}
          <div className="p-5">

            {/* ── Step 1 ────────────────────────────── */}
            <div className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <StepBadge number={1} done={step1Done} active={!step1Done} />
                {/* connector line */}
                <div className="w-0.5 flex-1 mt-2 rounded-full transition-all duration-500"
                     style={{
                       minHeight: 56,
                       background: connectorFull
                         ? '#34d399'
                         : connectorHalf
                         ? 'linear-gradient(to bottom, #34d399 0%, #e2e8f0 100%)'
                         : '#e2e8f0',
                     }} />
              </div>
              <div className="flex-1 pb-5 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Resume</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                    Required
                  </span>
                </div>
                <UploadZone file={resumeFile} onFile={setResumeFile} />
              </div>
            </div>

            {/* ── Step 2 ────────────────────────────── */}
            <div className="flex gap-3.5">
              <div className="pt-0.5">
                <StepBadge number={2} done={step2Done} active={step2Active} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Job Description</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    Optional
                  </span>
                </div>
                <UploadZone file={jdFile} onFile={setJdFile} />
              </div>
            </div>
          </div>

          {/* status strip */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: step1Done && step2Done ? '100%' : step1Done ? '50%' : '0%',
                    background: 'linear-gradient(90deg,#6366f1,#10b981)',
                  }}
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {step1Done && step2Done ? '2/2 Ready' : step1Done ? '1/2 Done' : '0/2 Done'}
              </span>
            </div>
          </div>
        </div>

        {/* Tip card */}
        <div className="rounded-2xl p-4"
             style={{
               background: 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.05))',
               border: '1px solid rgba(99,102,241,.14)',
             }}>
          <p className="text-xs font-bold text-indigo-700 mb-1">💡 Pro tip</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload a job description alongside your resume for a tailored ATS compatibility score.
          </p>
        </div>

      </div>
    </aside>
  )
}
