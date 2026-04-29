import { useState } from "react";
import axios from "axios";
import AdminNavBar from "../components/adminnav";

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

      alert("✅ Message sent successfully");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f4f7fb] min-h-screen text-gray-800">
      <AdminNavBar />

      <main className="ml-56 w-full p-8 pt-20">
        <div className="max-w-2xl mx-auto">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-700 text-white p-6 rounded-2xl shadow-lg mb-6">
            <p className="text-sm text-blue-200 font-semibold uppercase tracking-wide">
              Admin Notification
            </p>

            <h1 className="text-3xl font-bold mt-1">
              Broadcast Message
            </h1>

            <p className="text-blue-100 mt-2 text-sm">
              Send announcements to all users, technicians or admins instantly.
            </p>
          </div>

          {/* CARD */}
          <form
            onSubmit={sendMessage}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* TOP BAR */}
            <div className="bg-blue-600 text-white p-5">
              <h2 className="text-lg font-bold">Send Notification</h2>
              <p className="text-sm text-blue-100">
                Choose target group and write your message
              </p>
            </div>

            {/* FORM BODY */}
            <div className="p-6 space-y-5">

              {/* ROLE */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Send To
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="ALL">🌐 All Users</option>
                  <option value="USER">👤 Users</option>
                  <option value="TECHNICIAN">🛠 Technicians</option>
                  <option value="ADMIN">🧑‍💼 Admins</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  placeholder="Type your announcement here..."
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-t">

              <button
                type="button"
                onClick={() => setMessage("")}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
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