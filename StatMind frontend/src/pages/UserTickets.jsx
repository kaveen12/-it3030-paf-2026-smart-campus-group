import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { getSessionUser } from "../utils/sessionUser";
export const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();



  useEffect(() => {
    fetchTickets();
  }, [sortBy]);

  const sessionUser = getSessionUser();

const fetchTickets = async () => {
  setLoading(true);
  setError("");

  try {
    const data = await ticketAPI.getAllTickets();

    const userTickets = Array.isArray(data)
      ? data
          .filter((ticket) => ticket.createdById === sessionUser.userId)
          .sort(
            (a, b) =>
              new Date(b[sortBy] || 0) - new Date(a[sortBy] || 0)
          )
      : [];

    setTickets(userTickets);
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    setError("Failed to load tickets");
    setTickets([]);
  } finally {
    setLoading(false);
  }
};

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 mt-1">
            View and manage your submitted tickets
          </p>
        </div>

        <button
          onClick={() => navigate("/user/tickets/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Create Ticket
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow border border-gray-100 mb-6 p-4 flex justify-between items-center">
        <p className="text-gray-700 font-medium">
          {loading ? "Loading tickets..." : `Showing ${tickets.length} ticket(s)`}
        </p>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          <option value="updatedAt">Sort by last modified</option>
          <option value="createdAt">Sort by created date</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Ticket
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Resource
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Priority
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Created
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Last Modified
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    {ticket.category}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.description}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.resourceName || "Manual Location"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.resourceCode || ticket.resourceOrLocation || "No resource"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.location || ""}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(ticket.createdAt)}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(ticket.updatedAt)}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/user/tickets/${ticket.id}`)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  Loading tickets...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTickets;