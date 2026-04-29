import { useNavigate } from "react-router-dom";

export const UserTicketHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-600 mt-1">Create and track your incident reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate("/user/tickets/create")}
          className="p-8 bg-white rounded-xl shadow cursor-pointer hover:shadow-lg border border-gray-100 transition transform hover:scale-105"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">📝 Create Ticket</h2>
              <p className="text-gray-600 mt-2">Report a new campus maintenance issue</p>
            </div>
          </div>
          <button className="mt-5 bg-[#2563eb] hover:bg-[#1e40af] text-white px-5 py-2 rounded-lg font-medium transition">
            + Create Ticket
          </button>
        </div>

        <div
          onClick={() => navigate("/user/tickets/list")}
          className="p-8 bg-white rounded-xl shadow cursor-pointer hover:shadow-lg border border-gray-100 transition transform hover:scale-105"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">📋 View My Tickets</h2>
              <p className="text-gray-600 mt-2">See all tickets you have submitted</p>
            </div>
          </div>
          <button className="mt-5 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2 rounded-lg font-medium transition">
            View Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTicketHome;