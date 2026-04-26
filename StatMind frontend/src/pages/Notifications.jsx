import { useEffect, useState } from "react";
import axios from "axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔹 Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/api/notifications/user/user1"
      );
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // 🔹 Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/api/notifications/${id}/read`
      );
      fetchNotifications(); // refresh list
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="text-lg font-semibold">
                {notification.message}
              </h2>

              <p>Type: {notification.type}</p>

              <p>
                Status:{" "}
                <span
                  className={
                    notification.read
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {notification.read ? "Read" : "Unread"}
                </span>
              </p>

              <p className="text-sm text-gray-500">
                {notification.createdAt}
              </p>

              {/* 🔹 Button only shows if unread */}
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;