import { useEffect, useState } from "react";
import { ticketAPI } from "../api/ticketService";
import { Link } from "react-router-dom";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

const TECH_ID = "TECH001";

export const TechnicianTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);

    try {
      const data = await ticketAPI.getAllTickets();

      const filtered = Array.isArray(data)
        ? data
            .filter((t) => t.assignedTechnicianId === TECH_ID)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        : [];

      setTickets(filtered);
    } catch (error) {
      console.error("Failed to load technician tickets", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;
  const highPriorityCount = tickets.filter(
    (t) => t.priority === "HIGH" || t.priority === "CRITICAL"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assigned Tickets</h1>
        <p className="text-gray-600 mt-1">
          View and update tickets assigned to you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <p className="text-gray-600 text-sm">Total Assigned</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{tickets.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
  <p className="text-gray-600 text-sm">Resolved</p>
  <p className="text-3xl font-bold text-green-600 mt-2">{resolvedCount}</p>
</div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
          <p className="text-gray-600 text-sm">High Priority</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{highPriorityCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            My Assigned Work
          </h2>
          <p className="text-sm text-gray-600">
            Showing {tickets.length} ticket(s)
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-600">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No tickets assigned
            </h3>
            <p className="text-gray-600 mt-2">
              Assigned tickets will appear here after admin assigns them to you.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-white">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">Ticket</th>
                <th className="px-6 py-4 text-sm font-semibold">Location</th>
                <th className="px-6 py-4 text-sm font-semibold">Priority</th>
                <th className="px-6 py-4 text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-sm font-semibold">Last Modified</th>
                <th className="px-6 py-4 text-sm font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{ticket.category}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {ticket.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      #{ticket.id?.substring(0, 8)}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {ticket.location || ticket.resourceOrLocation || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(ticket.updatedAt)}
                  </td>

                  <td className="px-6 py-4">
                    <Link
                      to={`/technician/tickets/${ticket.id}`}
                      className="bg-[#2563eb] hover:bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};