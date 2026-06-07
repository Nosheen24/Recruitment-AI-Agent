/* Shared components used across multiple tab files */

export function EmptyState({ icon, title, text, onAction, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 mt-1 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 animate-float text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed mb-5">{text}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          style={{ boxShadow: '0 4px 14px rgba(99,102,241,.30)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function PrimaryButton({ onClick, loading, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="btn-primary w-full flex items-center justify-center gap-2.5 text-white font-semibold text-sm rounded-xl py-3 active:scale-[.99]"
    >
      {loading
        ? <><Spinner /><span>Processing…</span></>
        : children}
    </button>
  )
}

export function Spinner() {
  return (
    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
  )
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-slate-200 bg-white rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export function ResultCard({ children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-4 shadow-sm animate-fadeIn">
      {children}
    </div>
  )
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-100 pb-3 mb-5">
      {children}
    </h2>
  )
}

export function ErrorBanner({ message }) {
  const isNetwork = message.includes('fetch')
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3.5 mb-4">
      {isNetwork
        ? '⚠️ Cannot reach the backend. Start the API server with: python api.py'
        : `❌ ${message}`}
    </div>
  )
}
