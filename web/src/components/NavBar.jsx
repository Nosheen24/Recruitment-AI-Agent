export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16"
            style={{ background: 'rgba(3,7,18,.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200 group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 14px rgba(99,102,241,.4)' }}>
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight font-display">
            Recruitment<span className="text-indigo-400"> AI</span>
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features',     href: '#features' },
            { label: 'How it works', href: '#tool'     },
            { label: 'Pricing',      href: '#tool'     },
          ].map(({ label, href }) => (
            <a key={label} href={href}
               className="nav-link text-sm text-slate-400 hover:text-white transition-colors duration-150 font-medium">
              {label}
            </a>
          ))}
        </nav>

        {/* CTA button */}
        <a href="#tool"
           className="btn-primary inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl">
          Get Started Free
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </header>
  )
}
