import AdminNavbar from "../components/adminnav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Boxes,
  CalendarCheck,
  Activity,
  RefreshCw,
} from "lucide-react";

function AdminDashboardPage() {
  const navigate = useNavigate();

  // STATES
  const [stats, setStats] = useState({
    users: 0,
    resources: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // FETCH DATA
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, resourcesRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/users"),
        axios.get("http://localhost:8081/api/resources"),
        axios.get("http://localhost:8081/api/bookings"),
      ]);

      setStats({
        users: usersRes.data?.length || 0,
        resources: resourcesRes.data?.length || 0,
        bookings: bookingsRes.data?.length || 0,
      });
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCounts();
    setRefreshing(false);
  };

  const cards = [
    {
      title: "Users",
      desc: "Manage system users",
      path: "/users",
      icon: <Users size={20} />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Resources",
      desc: "Manage campus resources",
      path: "/resourceDashboard",
      icon: <Boxes size={20} />,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Bookings",
      desc: "View and manage reservations",
      path: "/bookings",
      icon: <CalendarCheck size={20} />,
      color: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <div className="ml-56 mt-14 bg-slate-100 min-h-screen">
        <div className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Monitor system performance & manage operations
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

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <StatCard
              title="Total Users"
              value={stats.users}
              icon={<Users size={18} />}
              color="border-blue-500"
              loading={loading}
            />

            <StatCard
              title="Resources"
              value={stats.resources}
              icon={<Boxes size={18} />}
              color="border-green-500"
              loading={loading}
            />

            <StatCard
              title="Bookings"
              value={stats.bookings}
              icon={<CalendarCheck size={18} />}
              color="border-purple-500"
              loading={loading}
            />
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

          {/* =========================
              SYSTEM OVERVIEW SECTION
          ========================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* SYSTEM STATUS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                System Status
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Server</span>
                  <span className="text-green-600 font-semibold">Online</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Database</span>
                  <span className="text-green-600 font-semibold">Connected</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">API Health</span>
                  <span className="text-green-600 font-semibold">Stable</span>
                </div>
              </div>
            </div>

            {/* ACTIVITY BARS */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                Live Activity
              </h2>

              <div className="space-y-3">

                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-blue-500 w-[70%] rounded"></div>
                </div>
                <p className="text-xs text-gray-500">User Activity</p>

                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-green-500 w-[55%] rounded"></div>
                </div>
                <p className="text-xs text-gray-500">Resource Usage</p>

                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-purple-500 w-[40%] rounded"></div>
                </div>
                <p className="text-xs text-gray-500">Booking Flow</p>

              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                Recent Activity
              </h2>

              <ul className="space-y-3 text-sm text-gray-600">
                <li>✔ New user registered</li>
                <li>✔ Resource updated</li>
                <li>✔ Booking confirmed</li>
                <li>✔ System backup completed</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

/* =========================
   STAT CARD COMPONENT
========================= */
function StatCard({ title, value, icon, color, loading }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color}`}>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="text-gray-400">{icon}</div>
      </div>

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

export default AdminDashboardPage;