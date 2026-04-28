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

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        <div className="mb-6">
          <p className="text-sm text-blue-600 font-semibold">
            Notification Center
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            View system updates and mark unread messages as read.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Total Notifications</p>
            <h2 className="text-3xl font-bold mt-2">{notifications.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Unread</p>
            <h2 className="text-3xl font-bold mt-2 text-red-500">
              {unreadCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border">
            <p className="text-sm text-gray-500">Read</p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {notifications.length - unreadCount}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <h2 className="text-lg font-semibold">All Notifications</h2>
              <p className="text-sm text-gray-500">
                Latest notifications for your account
              </p>
            </div>

            <button
              onClick={fetchNotifications}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Refresh
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <div className="text-5xl mb-3">🔔</div>
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 flex justify-between gap-4 ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notification.type === "LOGIN" && "👋 "}
                      {notification.type === "ADMIN_MESSAGE" && "📢 "}
                      {notification.type === "BOOKING" && "📅 "}
                      {notification.type === "TICKET" && "🎫 "}
                      {notification.message}
                    </h3>

                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
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

                    <p className="text-sm text-gray-500 mt-2">
                      {notification.createdAt}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="h-fit bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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