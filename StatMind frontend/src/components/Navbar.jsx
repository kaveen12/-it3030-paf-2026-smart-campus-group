import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      {/* Sidebar */}
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

          <li>
            <Link to="/bulk" className="block hover:bg-blue-800 p-2 rounded">
              Bulk Resources
            </Link>
          </li>
        </ul>
      </div>


      {/* Top Navbar */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-40">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-700">
          Admin Dashboard
        </h2>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium">Admin</span>

          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;