import AdminNavbar from "../components/AdminNavbar";
import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Users",
      desc: "Manage system users",
      path: "/users",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" fill="currentColor"/>
          <path d="M8 13c-2.67 0-8 1.34-8 4v2h10v-2c0-1.3.84-2.4 2-3-1.5-.6-2.5-1-4-1z" fill="currentColor" opacity="0.7"/>
        </svg>
      ),
    },
    {
      title: "Resources",
      desc: "Manage all resources",
      path: "/resourceDashboard",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 10h16" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      title: "Bookings",
      desc: "View reservations",
      path: "/bookings",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M7 2v3M17 2v3M3 9h18" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 5h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <AdminNavbar />

      {/* MAIN AREA */}
      <div className="fixed top-14 left-56 right-0 bottom-0 bg-slate-100 p-6 overflow-auto">

        <div className="bg-white rounded-2xl shadow-md p-6 min-h-full">

          {/* HEADER (CENTERED) */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Welcome back, manage everything from here
            </p>

          </div>

          {/* MINI STATS */}
          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="bg-blue-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-700">120</p>
            </div>

            <div className="bg-green-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-green-700">45</p>
            </div>

            <div className="bg-purple-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-purple-700">78</p>
            </div>

          </div>

          {/* DARK CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {cards.map((card) => (
              <div
                key={card.title}
                onClick={() => navigate(card.path)}
                className="cursor-pointer p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 bg-slate-900 text-white"
              >

                {/* ICON + ARROW */}
                <div className="flex justify-between items-center">

                  <div className="p-2 bg-slate-800 rounded-lg">
                    {card.icon}
                  </div>

                  <span className="text-xl text-slate-400">→</span>

                </div>

                {/* TITLE */}
                <h2 className="text-lg font-semibold mt-4">
                  {card.title}
                </h2>

                {/* DESC */}
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