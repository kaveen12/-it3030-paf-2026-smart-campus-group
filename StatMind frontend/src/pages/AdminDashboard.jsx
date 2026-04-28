import AdminNavbar from "../components/adminnav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboardPage() {
  const navigate = useNavigate();

  // 🔹 STATES
  const [userCount, setUserCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  // 🔹 FETCH DATA
  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // 🔥 parallel API calls
      const [usersRes, resourcesRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/users"),
        axios.get("http://localhost:8081/api/resources"),
        axios.get("http://localhost:8081/api/bookings"),
      ]);

      setUserCount(usersRes.data.length);
      setResourceCount(resourcesRes.data.length);
      setBookingCount(bookingsRes.data.length);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const cards = [
    {
      title: "Users",
      desc: "Manage system users",
      path: "/users",
    },
    {
      title: "Resources",
      desc: "Manage all resources",
      path: "/resourceDashboard",
    },
    {
      title: "Bookings",
      desc: "View reservations",
      path: "/bookings",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <div className="fixed top-14 left-56 right-0 bottom-0 bg-slate-100 p-6 overflow-auto">

        <div className="bg-white rounded-2xl shadow-md p-6 min-h-full">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, manage everything from here
            </p>
          </div>

          {/*  DYNAMIC STATS */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="bg-blue-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-700">
                {userCount}
              </p>
            </div>

            <div className="bg-green-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-green-700">
                {resourceCount}
              </p>
            </div>

            <div className="bg-purple-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-purple-700">
                {bookingCount}
              </p>
            </div>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {cards.map((card) => (
              <div
                key={card.title}
                onClick={() => navigate(card.path)}
                className="cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 bg-slate-900 text-white"
              >
                <h2 className="text-lg font-semibold">
                  {card.title}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {card.desc}
                </p>

              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;