import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/notifications",
    label: "Notifications",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    to: "/",
    label: "Bookings",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7v5c0 1.657 3.582 3 8 3s8-1.343 8-3V7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 12v5c0 1.657 3.582 3 8 3s8-1.343 8-3v-5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    to: "/user/tickets",
    label: "Tickets",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 13h4M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function UserNavbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* SIDEBAR */}
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
                key={label}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition ${
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

        {/* SIDEBAR LOGOUT */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* TOP NAVBAR */}
      <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b flex items-center justify-between px-6 z-40 shadow-sm">

        {/* LEFT */}
        <h1 className="text-lg font-semibold text-gray-800">
          User Panel
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">User</span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm">
            Logout
          </button>
        </div>
      </header>
    </>
  );
}

export default UserNavbar;