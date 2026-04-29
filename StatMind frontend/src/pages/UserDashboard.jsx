import React, { useState, useEffect } from "react";
import UserNavbar from "../components/usernav";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Activity,
  RefreshCw,
  User,
} from "lucide-react";

function UserDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [bookings, setBookings] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // ✅ FIXED USER NAME
    const storedName =
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      "User";

    setUserName(storedName);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/bookings/user/${userId}`
      );
      const data = await res.json();

      setBookings(data);

      setStats({
        total: data.length,
        approved: data.filter((b) => b.status === "APPROVED").length,
        pending: data.filter((b) => b.status === "PENDING").length,
        rejected: data.filter((b) => b.status === "REJECTED").length,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const cards = [
    {
      title: "My Bookings",
      desc: "View all your reservations",
      path: "/my-bookings",
      icon: <CalendarCheck size={20} />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Create Booking",
      desc: "Make a new reservation",
      path: "/create-booking",
      icon: <Activity size={20} />,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Profile",
      desc: "Manage your account",
      path: "/profile",
      icon: <User size={20} />,
      color: "from-green-500 to-green-700",
    },
  ];

  return (
    <>
      <UserNavbar />

      <div className="ml-56 mt-14 bg-slate-100 min-h-screen">
        <div className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {userName} 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your bookings and activity
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition text-sm"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatCard title="Total Bookings" value={stats.total} loading={loading} color="border-gray-500" />
            <StatCard title="Approved" value={stats.approved} loading={loading} color="border-green-500" />
            <StatCard title="Pending" value={stats.pending} loading={loading} color="border-yellow-500" />
            <StatCard title="Rejected" value={stats.rejected} loading={loading} color="border-red-500" />
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
              <Activity size={18} />
              Quick Actions
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className={`cursor-pointer rounded-xl p-5 text-white shadow-md bg-gradient-to-r ${card.color} hover:scale-[1.03] transition`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{card.title}</h2>
                    {card.icon}
                  </div>
                  <p className="text-sm text-white/80 mt-2">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== BOTTOM SECTIONS ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ACCOUNT STATUS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                Account Status
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Profile</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Bookings</span>
                  <span className="text-green-600 font-semibold">Available</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Access</span>
                  <span className="text-green-600 font-semibold">Granted</span>
                </div>
              </div>
            </div>

            {/* ACTIVITY BARS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                Your Activity
              </h2>

              <div className="space-y-3">
                <Progress label="Approved" value={stats.approved} total={stats.total} color="bg-green-500" />
                <Progress label="Pending" value={stats.pending} total={stats.total} color="bg-yellow-500" />
                <Progress label="Rejected" value={stats.rejected} total={stats.total} color="bg-red-500" />
              </div>
            </div>

            {/* RECENT BOOKINGS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                Recent Bookings
              </h2>

              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-gray-400 text-sm">No bookings yet</p>
              ) : (
                <ul className="space-y-3 text-sm text-gray-600">
                  {bookings.slice(0, 4).map((b, i) => (
                    <li key={i}>
                      ✔ {b.service} ({b.status})
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

/* STAT CARD */
function StatCard({ title, value, loading, color }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{title}</p>

      {loading ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
      ) : (
        <h2 className="text-2xl font-bold text-gray-800 mt-2">
          {value}
        </h2>
      )}
    </div>
  );
}

/* PROGRESS BAR */
function Progress({ label, value, total, color }) {
  const percent = total === 0 ? 0 : (value / total) * 100;

  return (
    <div>
      <div className="h-2 bg-gray-200 rounded">
        <div
          className={`h-2 ${color} rounded`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default UserDashboard;