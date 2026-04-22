import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-blue-700 text-white z-50 shadow-xl">
        <div className="p-5 border-b border-blue-600">
          <h1 className="text-2xl font-bold">StatMind</h1>
        </div>

        <ul className="p-4 space-y-3">
          <li>
            <Link
              to="/"
              className="block px-4 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/add"
              className="block px-4 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Add Resource
            </Link>
          </li>

          <li>
            <Link
              to="/view"
              className="block px-4 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              View Resources
            </Link>
          </li>

          
        </ul>
      </div>

      {/* Top Navbar */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md z-40 flex items-center justify-between px-6">
        <h2 className="text-xl font-bold text-gray-700">
          Admin Dashboard
        </h2>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">Admin</span>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;