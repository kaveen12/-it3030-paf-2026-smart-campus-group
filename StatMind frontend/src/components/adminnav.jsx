import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo-UniCore.png";

const navItems = [
  { path: "/admin", name: "Dashboard" },
  { path: "/users", name: "User Management" },
  { path: "/send-notification", name: "Send Notifications" },
  { path: "/resourceDashboard", name: "Resource Management" },
  { path: "/bookings", name: "Booking Management" },
  { path: "/admin/tickets", name: "Ticket Management" },
];

function AdminNavbar() {
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const userName =
    localStorage.getItem("name") ||
    localStorage.getItem("email")?.split("@")[0] ||
    "Admin";
  const userEmail = localStorage.getItem("email") || "";

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
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/notifications/user/${userId}/unread-count`
      );
      setUnreadCount(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-56 h-screen bg-[#0f172a] flex flex-col p-4">

        <div className="flex items-center gap-3 mb-8">
          <img src={logo} className="w-8 h-8" />
          <span className="text-white">UniCore</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 ${
                location.pathname === item.path
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <button onClick={logout} className="text-red-400">
            Logout
          </button>
        </div>
      </aside>

      {/* TOP BAR */}
      <header className="fixed top-0 left-56 right-0 h-14 bg-white flex justify-between items-center px-6">

        <h1>Admin Panel</h1>

        <div className="flex items-center gap-4 relative">

          {/* Bell */}
          <button onClick={() => setOpen(!open)}>
            🔔 {unreadCount}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-12 bg-white p-4 shadow w-80">
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id}>{n.message}</div>
                ))
              )}
            </div>
          )}

          {/* User */}
          <div>
            {userName}
            <br />
            <small>{userEmail}</small>
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      </header>
    </>
  );
}

export default AdminNavbar;