import { useState, useRef, useEffect } from 'react'
import { EmptyState, Spinner, SectionTitle } from '../shared'

const SUGGESTIONS = [
  "What are the candidate's top technical skills?",
  "How many years of experience do they have?",
  "What projects have they worked on?",
  "What is their highest educational qualification?",
]

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="bg-indigo-500 text-white text-sm rounded-2xl rounded-br-md px-4 py-2.5 max-w-[75%] shadow-sm leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function BotBubble({ text }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-xs font-black text-indigo-600 flex-shrink-0 mt-0.5">
        AI
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-700 max-w-[80%] leading-relaxed">
        {text}
      </div>
    </div>
  )
}

export default function ChatTab({ resumeFile, chatHistory, setChatHistory }) {
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory])

  if (!resumeFile) {
    return (
      <EmptyState
        icon="💬"
        title="No resume loaded"
        text="Upload your resume in the sidebar, then ask any question about the candidate's background, skills, or experience."
      />
    )
  }

  const send = async text => {
    const q = text.trim(); if (!q) return
    setInput('')
    setChatHistory(h => [...h, { role: 'user', content: q }])
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('resume', resumeFile)
      fd.append('question', q)
      const res = await fetch('/api/chat', { method: 'POST', body: fd })
      const { answer } = await res.json()
      setChatHistory(h => [...h, { role: 'bot', content: answer }])
    } catch {
      setChatHistory(h => [...h, { role: 'bot', content: '⚠️ Could not reach the backend. Start the API server.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <SectionTitle>💬 Chat with Resume</SectionTitle>

      {/* suggestion chips — visible only before first message */}
      {chatHistory.length === 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">💡 Try asking</p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-left text-xs text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-150 shadow-sm font-medium leading-relaxed"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* message thread */}
      {chatHistory.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-3 min-h-[260px] max-h-[400px] overflow-y-auto space-y-3 shadow-sm">
          {chatHistory.map((m, i) =>
            m.role === 'user'
              ? <UserBubble key={i} text={m.content} />
              : <BotBubble  key={i} text={m.content} />
          )}
          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-xs font-black text-indigo-600 flex-shrink-0">AI</div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {chatHistory.length > 0 && (
        <button
          onClick={() => setChatHistory([])}
          className="text-xs text-slate-400 hover:text-red-400 font-medium transition-colors mb-3"
        >
          🗑️ Clear conversation
        </button>
      )}

      {/* input row */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !loading && send(input)}
          placeholder="Ask anything about the resume…"
          className="flex-1 border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md"
          style={{ boxShadow: '0 4px 14px rgba(99,102,241,.28)' }}
        >
          {loading ? <Spinner /> : null}
          Send
        </button>
      </div>
    </div>
  )
}
