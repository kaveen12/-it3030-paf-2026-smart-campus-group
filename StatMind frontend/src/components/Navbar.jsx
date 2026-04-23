import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "View bookings",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="9" y="6" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="1" y="12" width="6" height="3" rx="1.5" fill="currentColor" />
        <rect x="9" y="1" width="6" height="3" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: "/create",
    label: "Create booking",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/view",
    label: "View resources",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 13c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/my-bookings",
    label: "My bookings",
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[#0f172a] flex flex-col p-4 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
            <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
            <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
            <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" />
          </svg>
        </div>
        <span className="text-[15px] font-medium text-slate-100 tracking-tight">StatMind</span>
      </div>

      {/* Section label */}
      <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium px-2.5 mb-2">
        Navigation
      </p>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                active
                  ? "bg-[#1e3a5f] text-blue-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
    <div className="mt-auto pt-4 border-t border-slate-800">
      <button
        onClick={() => {/* handle logout */}}
        className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors w-full"
      >
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
        <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 11l3-3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
        Logout
      </button>
    </div>
    </aside>
  );
}

export default Navbar;