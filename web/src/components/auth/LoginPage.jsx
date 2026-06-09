import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage({ onClose }) {
  const { login, register } = useAuth()
  const [tab,     setTab]     = useState('login')   // 'login' | 'signup'
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [password,setPassword]= useState('')
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) { setError('Name is required.'); return }
        await register(name.trim(), email, password)
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,.22)' }}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10"
        >
          <X size={16} />
        </button>

        {/* gradient header */}
        <div className="px-8 pt-8 pb-6"
             style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)' }}>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg mb-4">✦</div>
          <h2 className="text-white font-black text-xl font-display">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-indigo-200 text-sm mt-1">
            {tab === 'login'
              ? 'Sign in to access your history and saved sessions.'
              : 'Save your analyses and HR sessions across devices.'}
          </p>
        </div>

        {/* tab switcher */}
        <div className="flex border-b border-slate-100">
          {['login', 'signup'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null) }}
              className={[
                'flex-1 py-3 text-sm font-bold transition-colors duration-150',
                tab === t
                  ? 'text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50'
                  : 'text-slate-400 hover:text-slate-700',
              ].join(' ')}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* form */}
        <form onSubmit={submit} className="px-8 py-6 space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@company.com"
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
              required
              minLength={6}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-[.99] disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
              boxShadow: loading ? 'none' : '0 4px 18px rgba(99,102,241,.35)',
            }}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              : tab === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>

          <p className="text-center text-xs text-slate-400">
            {tab === 'login'
              ? <>Don't have an account?{' '}
                  <button type="button" onClick={() => { setTab('signup'); setError(null) }}
                          className="text-indigo-500 font-semibold hover:underline">Sign up</button></>
              : <>Already have an account?{' '}
                  <button type="button" onClick={() => { setTab('login'); setError(null) }}
                          className="text-indigo-500 font-semibold hover:underline">Sign in</button></>
            }
          </p>
        </form>
      </div>
    </div>
  )
}
