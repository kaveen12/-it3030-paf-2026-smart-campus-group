import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-blue-700 text-white p-5 z-50">
      <h1 className="text-2xl font-bold mb-8">StatMind</h1>

      <ul className="space-y-4">
        <li>
          <Link to="/" className="block hover:bg-blue-800 p-2 rounded">
            view Bookings
          </Link>
        </li>

        <li>
          <Link to="/create" className="block hover:bg-blue-800 p-2 rounded">
            Create Booking
          </Link>
        </li>

        <li>
          <Link to="/view" className="block hover:bg-blue-800 p-2 rounded">
            View Resources
          </Link>
        </li>

        <li>
          <Link to="/my-bookings" className="block hover:bg-blue-800 p-2 rounded">
            My Bookings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;