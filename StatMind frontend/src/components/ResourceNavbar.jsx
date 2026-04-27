import { Link, useLocation } from "react-router-dom";


const navItems = [
    {
    to: "/",
    label: "Admin Dashboard",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: "/resourceDashboard",
    label: " Resource Dashboard",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="9" y="6" width="6" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="1" y="12" width="6" height="3" rx="1.5" fill="currentColor" />
        <rect x="9" y="1" width="6" height="3" rx="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    to: "/addResource",
    label: "Add Resource",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/viewResource",
    label: "View Resources",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 13c0-2.7 2.6-5 6-5s6 2.3 6 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function ResourcesNavbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* 🔷 SIDEBAR */}
      <aside className="fixed left-0 top-0 w-56 h-screen bg-[#0f172a] flex flex-col p-4 z-50">

        {/* LOGO */}
        <div className="flex items-center gap-2.5 px-2 mb-7">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-white">StatMind</span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon }) => {
            const active = pathname === to;

            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-[#1e3a5f] text-blue-300"
                    :"text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* SIDEBAR LOGOUT */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* 🔷 TOP NAVBAR */}
      <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b flex items-center justify-between px-6 z-40 shadow-sm">
        
        {/* LEFT */}
        <h1 className="text-lg font-semibold text-gray-800">
          Admin Panel
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          
          <span className="text-sm text-gray-600">
            Admin
          </span>

          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm">
            Logout
          </button>

        </div>
      </header>
    </>
  );
}

export default ResourcesNavbar;