import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/api/notifications/user/user1/unread-count"
      );
      setUnreadCount(res.data);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-blue-700 text-white p-5 z-50">
      <h1 className="text-2xl font-bold mb-8">StatMind</h1>

      <ul className="space-y-4">
        <li>
          <Link to="/" className="block hover:bg-blue-800 p-2 rounded">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/add" className="block hover:bg-blue-800 p-2 rounded">
            Add Resource
          </Link>
        </li>

        <li>
          <Link to="/view" className="block hover:bg-blue-800 p-2 rounded">
            View Resources
          </Link>
        </li>

        <li className="relative">
          <Link
            to="/notifications"
            className="block hover:bg-blue-800 p-2 rounded"
          >
            Notifications
          </Link>

          {/* 🔔 Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-2 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </li>

        <li>
          <Link to="/users" className="block hover:bg-blue-800 p-2 rounded">
          User Management
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Navbar;