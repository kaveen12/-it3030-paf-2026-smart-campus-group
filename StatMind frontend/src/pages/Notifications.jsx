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
    try {
      const res = await axios.get(
        `http://localhost:8081/api/notifications/user/${userId}`
      );
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
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
    <div className="flex bg-slate-100 min-h-screen text-slate-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-7 mb-6 text-white shadow">
          <p className="text-sm text-blue-200 font-semibold uppercase tracking-wide">
            Notification Center
          </p>
          <h1 className="text-3xl font-bold mt-1">Notifications</h1>
          <p className="text-blue-100 mt-2">
            View system updates, admin messages, booking alerts and ticket
            notifications.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">
                Total Notifications
              </p>
              <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
                🔔
              </span>
            </div>
            <h2 className="text-4xl font-bold mt-3 text-slate-900">
              {notifications.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">Unread</p>
              <span className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
                ●
              </span>
            </div>
            <h2 className="text-4xl font-bold mt-3 text-red-500">
              {unreadCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow border border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 font-medium">Read</p>
              <span className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-xl">
                ✓
              </span>
            </div>
            <h2 className="text-4xl font-bold mt-3 text-green-600">
              {readCount}
            </h2>
          </div>
        </div>

        {/* Notification list */}
        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b bg-white">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Notifications
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Latest notifications for your account
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition font-semibold"
            >
              Refresh
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-14 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-4xl mb-4">
                🔔
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No notifications yet
              </h3>
              <p className="text-slate-500 mt-2">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-5 flex justify-between gap-5 transition hover:shadow-md ${
                    notification.read
                      ? "bg-white border-slate-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        notification.read
                          ? "bg-slate-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {notification.message}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-3 text-sm">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {notification.type}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            notification.read
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {notification.read ? "Read" : "Unread"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-3">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="h-fit whitespace-nowrap bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Notifications;