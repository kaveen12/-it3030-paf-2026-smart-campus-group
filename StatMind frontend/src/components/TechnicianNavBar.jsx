import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/technician/tickets", label: "Assigned Tickets" },
];

function TechnicianNavBar() {
  const { pathname } = useLocation();

  return (
    <>
      <aside className="fixed left-0 top-0 w-56 h-screen bg-[#0f172a] flex flex-col p-4">
        <h1 className="text-white mb-6 text-lg">StatMind</h1>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded ${
                pathname === item.to
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="mt-auto text-red-400">Logout</button>
      </aside>

     <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b flex items-center justify-between px-6 z-40 shadow-sm">
  <h2 className="text-lg font-semibold text-gray-800">
    Technician Panel
  </h2>

  <div className="flex items-center gap-4">
    <span className="text-sm text-gray-600">Technician</span>
    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm">
      Logout
    </button>
  </div>
</header>
    </>
  );
}

export default TechnicianNavBar;