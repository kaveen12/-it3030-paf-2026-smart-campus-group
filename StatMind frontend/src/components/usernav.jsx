import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-UniCore.png";

const navItems = [
  {
    path: "/user/dashboard",
    name: "My Dashboard",
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
    path: "/resources",
    name: "Resources",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7v5c0 1.657 3.582 3 8 3s8-1.343 8-3V7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 12v5c0 1.657 3.582 3 8 3s8-1.343 8-3v-5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3a7 7 0 00-7 7v4l-1.5 2.5A1 1 0 004.5 18h15a1 1 0 00.86-1.5L19 14V10a7 7 0 00-7-7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 21a2 2 0 004 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    path: "/create-booking",
    name: "Bookings",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 13h4M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: "/tickets",
    name: "Tickets",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 9a2 2 0 012-2h16a2 2 0 012 2v1.5a2.5 2.5 0 000 5V17a2 2 0 01-2 2H4a2 2 0 01-2-2v-1.5a2.5 2.5 0 000-5V9z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M9 2v3M9 19v3M15 2v3M15 19v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function UserNav() {
  const location = useLocation();

  return (
    <>
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-56 h-screen bg-[#0f172a] flex flex-col p-4 z-50">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="UniCore Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-white font-semibold text-sm">UniCore</span>
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition ${
                  isActive
                    ? "bg-[#1e3a5f] text-blue-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* TOP NAVBAR */}
      <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b flex items-center justify-between px-6 z-40 shadow-sm">

        <h1 className="text-lg font-semibold text-gray-800">
          UniCore
        </h1>

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

export default UserNav;