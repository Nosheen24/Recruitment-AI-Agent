import { useState } from 'react'
import { BarChart2, MessageCircle, HelpCircle, Lightbulb, Wand2 } from 'lucide-react'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import Sidebar from './components/Sidebar'
import TabNav from './components/TabNav'
import AnalysisTab from './components/tabs/AnalysisTab'
import ChatTab from './components/tabs/ChatTab'
import QuestionsTab from './components/tabs/QuestionsTab'
import ImprovementsTab from './components/tabs/ImprovementsTab'
import GenerateTab from './components/tabs/GenerateTab'

const TABS = [
  { id: 'analysis',     icon: '📊', label: 'Analysis'     },
  { id: 'chat',         icon: '💬', label: 'Chat'         },
  { id: 'questions',    icon: '❓', label: 'Questions'    },
  { id: 'improvements', icon: '💡', label: 'Improvements' },
  { id: 'generate',     icon: '✨', label: 'Generate'     },
]

const FEATURES = [
  {
    Icon: BarChart2,
    title: 'ATS Analysis',
    desc: 'Score your resume against any job posting with our intelligent keyword engine.',
    topColor: '#6366f1',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
  },
  {
    Icon: MessageCircle,
    title: 'AI Resume Chat',
    desc: 'Ask anything about your experience — get instant, contextual answers.',
    topColor: '#8b5cf6',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
  },
  {
    Icon: HelpCircle,
    title: 'Interview Questions',
    desc: 'Tailored practice questions based on your role, skills, and company target.',
    topColor: '#06b6d4',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
  },
  {
    Icon: Lightbulb,
    title: 'Smart Improvements',
    desc: 'Actionable, prioritized suggestions to strengthen every section of your resume.',
    topColor: '#f59e0b',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    Icon: Wand2,
    title: 'Resume Generator',
    desc: 'Create a polished, ATS-optimized resume from your experience in minutes.',
    topColor: '#10b981',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
]

export default function App() {
  const [activeTab,      setActiveTab]      = useState('analysis')
  const [resumeFile,     setResumeFile]     = useState(null)
  const [jdFile,         setJdFile]         = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [chatHistory,    setChatHistory]    = useState([])

  const shared = { resumeFile, jdFile, analysisResult, setAnalysisResult, chatHistory, setChatHistory }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Fixed top nav */}
      <NavBar />

      {/* Full-screen dark hero */}
      <Hero />

      {/* Dark-to-white gradient bridge */}
      <div className="section-bridge" />

      {/* Features strip */}
      <section id="features" className="bg-white border-b border-slate-100 pb-20 pt-4">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
            Everything you need to land your next role
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURES.map(({ Icon, title, desc, topColor, iconBg, iconColor }) => (
              <div
                key={title}
                className={`rounded-2xl bg-white p-5 cursor-default transition-all duration-300 hover:-translate-y-1`}
                style={{
                  border: '1px solid #f1f5f9',
                  borderTop: `3px solid ${topColor}`,
                  boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,.1), 0 4px 16px rgba(0,0,0,.05)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.04)')}
              >
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={iconColor} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 font-display">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool section */}
      <section id="tool" className="py-20 dot-grid" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* section heading */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4">
              AI Tools
            </span>
            <h2 className="font-display font-black text-slate-900 leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              Analyze, Improve &amp; Generate
            </h2>
            <p className="text-slate-500 mt-3 mx-auto text-sm" style={{ maxWidth: 460 }}>
              Upload your resume below and let AI do the heavy lifting.
            </p>
          </div>

          {/* sidebar + content */}
          <div className="flex gap-8 items-start">
            <Sidebar
              resumeFile={resumeFile} setResumeFile={setResumeFile}
              jdFile={jdFile}         setJdFile={setJdFile}
            />
            <div className="flex-1 min-w-0">
              <TabNav tabs={TABS} active={activeTab} onSelect={setActiveTab} />
              <div className="tab-panel">
                {activeTab === 'analysis'     && <AnalysisTab     key="analysis"     {...shared} />}
                {activeTab === 'chat'         && <ChatTab         key="chat"         {...shared} />}
                {activeTab === 'questions'    && <QuestionsTab    key="questions"    {...shared} />}
                {activeTab === 'improvements' && <ImprovementsTab key="improvements" {...shared} />}
                {activeTab === 'generate'     && <GenerateTab     key="generate"     {...shared} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                 style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>✦</div>
            <span className="text-sm font-bold text-slate-700 font-display">
              Recruitment<span className="text-indigo-500"> AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">© 2024 Recruitment AI · Powered by advanced language models</p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-xs text-slate-400 hover:text-slate-700 transition-colors duration-150 font-medium">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
