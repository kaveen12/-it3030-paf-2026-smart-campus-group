import { useState } from "react";
import axios from "axios";
import AdminNavBar from "../components/AdminNavBar";

function AdminSendNotification() {
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8081/api/notifications/send-to-role", {
        role,
        message,
        type: "ADMIN_MESSAGE",
      });

      alert(`Message sent to all ${role}s`);
      setMessage("");
      setRole("USER");
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-6 pt-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-blue-600 font-semibold">
            Admin Notification
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Send Group Notification
          </h1>

          <p className="text-gray-500 mb-6">
            Send one message to all users or all technicians at once.
          </p>

          <form
            onSubmit={sendMessage}
            className="bg-white rounded-2xl shadow border overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-xl font-bold">Broadcast Message</h2>
              <p className="text-sm text-blue-100 mt-1">
                Select the target role and write your message.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Send To
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">All Users</option>
                  <option value="TECHNICIAN">All Technicians</option>
                  <option value="ADMIN">All Admins</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  placeholder="Enter notification message..."
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4 border-t">
              <button
                type="button"
                onClick={() => setMessage("")}
                className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminSendNotification;