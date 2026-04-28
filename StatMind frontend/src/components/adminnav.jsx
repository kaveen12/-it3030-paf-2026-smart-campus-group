import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo-UniCore.png";

const navItems = [
  {
    to: "/AdminDashboard",
    label: "Dashboard",
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
    to: "/users",
    label: "User Management",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
  to: "/send-notification",
  label: "Send Notifications",
  icon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a7 7 0 00-7 7v4l-1.5 2.5A1 1 0 004.5 18h15a1 1 0 00.86-1.5L19 14v-4a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
},
  {
    to: "/resourceDashboard",
    label: "Resource Management",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7v5c0 1.657 3.582 3 8 3s8-1.343 8-3V7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 12v5c0 1.657 3.582 3 8 3s8-1.343 8-3v-5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    to: "/Bookings",
    label: "Booking Management",
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
    to: "/tickets",
    label: "Ticket Management",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M2 9a2 2 0 012-2h16a2 2 0 012 2v1.5a2.5 2.5 0 000 5V17a2 2 0 01-2 2H4a2 2 0 01-2-2v-1.5a2.5 2.5 0 000-5V9z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 2v3M9 19v3M15 2v3M15 19v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

function AdminNavBar() {
  const { pathname } = useLocation();

  const userId = localStorage.getItem("userId");
  const userName =
  localStorage.getItem("name") ||
  localStorage.getItem("email")?.split("@")[0] ||
  "User";
  const userEmail = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "ADMIN";

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/notifications/user/${userId}`
      );
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/notifications/user/${userId}/unread-count`
      );
      setUnreadCount(res.data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <aside className="fixed left-0 top-0 w-56 h-screen bg-[#0f172a] flex flex-col p-4 z-50">
        <div className="flex items-center gap-2.5 px-2 mb-7">
          <img
            src={logo}
            alt="StatMind Logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          <span className="text-[15px] font-medium text-white">UniCore</span>
        </div>

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
      </aside>

      <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b flex items-center justify-between px-6 z-40 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 rounded-full bg-white border shadow flex items-center justify-center"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-40 top-12 w-96 bg-white rounded-2xl shadow-xl border p-4 z-50 max-h-[500px] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">Notifications</h2>
                <span className="text-sm text-gray-500">{unreadCount} unread</span>
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 mb-3 rounded-xl border ${
                      n.read
                        ? "bg-white border-gray-200"
                        : "bg-green-50 border-green-300"
                    }`}
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">👋 {n.message}</p>
                        <p className="text-sm text-gray-600 mt-1">Type: {n.type}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.createdAt}</p>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          n.read ? "text-gray-400" : "text-green-600"
                        }`}
                      >
                        {n.read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center bg-[#0f172a] text-white py-3 rounded-xl font-semibold mt-3"
              >
                View all notifications
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 bg-white border rounded-full px-4 py-2 shadow-sm">
  
  {/* Avatar */}
  <div className="relative">
  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
    {userName.charAt(0).toUpperCase()}
  </div>

  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
</div>

  {/* User Info */}
  <div>
    <p className="text-sm font-semibold text-gray-800">
      {userName}
    </p>
    <p className="text-xs text-gray-500">
      {userEmail}
    </p>
  </div>
  

</div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
}

export default AdminNavBar;