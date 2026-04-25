import { useNavigate } from "react-router-dom";

export const UserTicketHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Create Ticket Card */}
        <div
          onClick={() => navigate("/user/tickets/create")}
          className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-lg font-semibold">Create Ticket</h2>
          <p className="text-gray-500 mt-2">Report a new issue</p>
        </div>

        {/* View Tickets Card */}
        <div
          onClick={() => navigate("/user/tickets/list")}
          className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
        >
          <h2 className="text-lg font-semibold">View My Tickets</h2>
          <p className="text-gray-500 mt-2">See all your tickets</p>
        </div>

      </div>
    </div>
  );
};