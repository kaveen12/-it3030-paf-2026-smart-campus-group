import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo-UniCore.png";
import { useNavigate } from "react-router-dom";

const navItems = [
    {
    to: "/admin",
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


function AdminNavBar() {
  const { pathname } = useLocation();

  const userId = localStorage.getItem("userId");
  const userName =
  localStorage.getItem("name") ||
  localStorage.getItem("email")?.split("@")[0] ||
  "User";
  const userEmail = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "ADMIN";
  const navigate = useNavigate(); 

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
            <div className="absolute right-4 top-14 w-72 max-h-72 overflow-y-auto bg-white rounded-2xl shadow-xl p-3 z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800">Notifications</h2>
                <span className="text-sm text-gray-500">{unreadCount} unread</span>
              </div>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notifications</p>
              ) : (
                notifications.slice(0, 2).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 mb-2 rounded-xl border ${
                      n.read
                        ? "bg-white border-gray-200"
                        : "bg-green-50 border-green-300"
                    }`}
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 leading-snug">👋 {n.message}</p>
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

          <div
  onClick={() => navigate("/profile")}
  className="flex items-center gap-3 bg-white border rounded-full px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition"
>
  {/* Avatar */}
  <div className="relative">
    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
      {userName.charAt(0).toUpperCase()}
    </div>

    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
  </div>

  {/* Info */}
  <div>
    <p className="text-sm font-semibold text-gray-800">{userName}</p>
    <p className="text-xs text-gray-500">{userEmail}</p>
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