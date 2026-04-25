import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketAPI } from "../api/ticketService";

export const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await ticketAPI.getAllTickets();

      // Filter ONLY user tickets (temporary)
      const userTickets = data.filter(
        (t) => t.createdByRole === "USER"
      );

      setTickets(userTickets);
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">My Tickets</h1>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="p-4 bg-white mb-3 rounded shadow flex justify-between"
        >
          <div>
            <p className="font-semibold">{ticket.category}</p>
            <p className="text-sm text-gray-500">{ticket.status}</p>
          </div>

          <button
            onClick={() => navigate(`/user/tickets/${ticket.id}`)}
            className="text-blue-500"
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};