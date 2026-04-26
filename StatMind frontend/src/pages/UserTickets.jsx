import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketAPI } from "../api/ticketService";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

export const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState("updatedAt");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [sortBy]);

  const fetchTickets = async () => {
    const data = await ticketAPI.getAllTickets();

    const userTickets = Array.isArray(data)
      ? data
          .filter((t) => t.createdByRole === "USER")
          .sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]))
      : [];

    setTickets(userTickets);
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
          <p className="text-gray-600 mt-1">View and manage your submitted tickets</p>
        </div>

        <button
          onClick={() => navigate("/user/tickets/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Create Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 mb-6 p-4 flex justify-between items-center">
        <p className="text-gray-700 font-medium">
          Showing {tickets.length} ticket(s)
        </p>

        <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="bg-[#0f172a] text-white border border-[#1e3a5f] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
          <option className="bg-white text-gray-900" value="updatedAt">
  Sort by last modified
</option>
<option className="bg-white text-gray-900" value="createdAt">
  Sort by created date
</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Ticket</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Created</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Last Modified</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">{ticket.category}</p>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.resourceName || ticket.resourceOrLocation || "No resource"}
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

            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};