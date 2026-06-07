import { useState } from 'react'
import { EmptyState, PrimaryButton, SelectField, ResultCard, SectionTitle, ErrorBanner } from '../shared'

export default function QuestionsTab({ resumeFile }) {
  const [qType,     setQType]     = useState('Technical')
  const [difficulty,setDifficulty]= useState('Medium')
  const [count,     setCount]     = useState(5)
  const [result,    setResult]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  if (!resumeFile) {
    return (
      <EmptyState
        icon="❓"
        title="No resume uploaded"
        text="Upload a resume to generate personalised interview questions tailored to the candidate's background."
      />
    )
  }

  const generate = async () => {
    setLoading(true); setError(null); setResult('')
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      fd.append('type', qType)
      fd.append('difficulty', difficulty)
      fd.append('count', String(count))
      const res = await fetch('/api/questions', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(await res.text())
      const { questions } = await res.json()
      setResult(questions)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>❓ Interview Question Generator</SectionTitle>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <SelectField
          label="Question Type" value={qType} onChange={setQType}
          options={['Technical','Behavioral','Coding','Scenario-based','Experience-based','Project-based']}
        />
        <SelectField
          label="Difficulty Level" value={difficulty} onChange={setDifficulty}
          options={['Easy','Medium','Hard']}
        />
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Questions: <span className="text-indigo-600">{count}</span>
          </label>
          <input
            type="range" min={3} max={15} step={1} value={count}
            onChange={e => setCount(+e.target.value)}
            className="w-full accent-indigo-500 cursor-pointer mt-1.5"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>3</span><span>15</span></div>
        </div>
      </div>

      <PrimaryButton onClick={generate} loading={loading}>⚡ Generate Questions</PrimaryButton>

      {error  && <ErrorBanner message={error} />}

      {result && (
        <ResultCard>
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          <div className="mt-5 pt-4 border-t border-slate-100">
            <a
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(result)}`}
              download="interview_questions.txt"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
            >
              📥 Download Questions
            </a>
          </div>
        </ResultCard>
      )}
    </div>
  )
}
