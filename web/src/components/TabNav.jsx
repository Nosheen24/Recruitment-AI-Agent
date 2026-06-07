export default function TabNav({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-1.5 bg-white rounded-2xl border border-slate-200 p-1.5 mb-6 overflow-x-auto"
         style={{ boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
      {tabs.map(({ id, icon, label }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={[
              'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
              isActive
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
            ].join(' ')}
            style={isActive ? {
              background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
              boxShadow: '0 4px 16px rgba(99,102,241,.40)',
            } : undefined}
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
