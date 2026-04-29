import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from "../components/AdminNavBar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await axios.get(
      `http://localhost:8081/api/notifications/user/${userId}`
    );
    setNotifications(res.data);
  };

  const markAsRead = async (id) => {
    await axios.put(`http://localhost:8081/api/notifications/${id}/read`);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.length - unreadCount;

  const icon = (type) => {
    if (type === "LOGIN") return "👋";
    if (type === "ADMIN_MESSAGE") return "📢";
    if (type === "BOOKING") return "📅";
    if (type === "TICKET") return "🎫";
    if (type === "COMMENT") return "💬";
    return "🔔";
  };

  const formatDate = (date) => {
    if (!date) return "Just now";
    return new Date(date).toLocaleString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.length - unreadCount;

  const getIcon = (type) => {
    if (type === "LOGIN") return "👋";
    if (type === "ADMIN_MESSAGE") return "📢";
    if (type === "BOOKING") return "📅";
    if (type === "TICKET") return "🎫";
    if (type === "COMMENT") return "💬";
    return "🔔";
  };

  const formatDate = (value) => {
    if (!value) return "Just now";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-slate-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-8 pt-24">
        <section className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#2563eb] p-8 text-white shadow-xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                UniCore Notification Center
              </p>
              <h1 className="text-4xl font-extrabold mt-2">Notifications</h1>
              <p className="text-blue-100 mt-2">
                Manage login alerts, admin messages, bookings and ticket updates.
              </p>
            </div>

            <div className="hidden md:flex w-20 h-20 rounded-3xl bg-white/15 items-center justify-center text-5xl backdrop-blur">
              🔔
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Total</p>
            <h2 className="text-4xl font-extrabold mt-2 text-slate-900">
              {notifications.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Unread</p>
            <h2 className="text-4xl font-extrabold mt-2 text-red-500">
              {unreadCount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">Read</p>
            <h2 className="text-4xl font-extrabold mt-2 text-green-600">
              {readCount}
            </h2>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Updates
              </h2>
              <p className="text-sm text-slate-500">
                Latest messages for your account
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              Refresh
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-5xl mb-5">
                🔔
              </div>
              <h3 className="text-2xl font-bold">No notifications yet</h3>
              <p className="text-slate-500 mt-2">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start justify-between gap-5 p-5 rounded-3xl border transition hover:shadow-lg ${
                    n.read
                      ? "bg-white border-slate-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        n.read ? "bg-slate-100" : "bg-blue-100"
                      }`}
                    >
                      {icon(n.type)}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {n.message}
                      </h3>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          {n.type}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            n.read
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {n.read ? "Read" : "Unread"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-3">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="whitespace-nowrap px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Notifications;