import UserNavbar from "../components/UserNavbar";

function UserDashboard() {
  return (
    <>
      <UserNavbar />

      {/* MAIN CONTENT */}
      <div className="ml-56 mt-14 p-6 bg-gray-100 min-h-screen">

        {/* PAGE TITLE */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Dashboard
        </h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm text-gray-500">Total Bookings</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm text-gray-500">Active Resources</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">5</p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm text-gray-500">Notifications</h3>
            <p className="text-2xl font-bold text-yellow-500 mt-2">3</p>
          </div>

          {/* CARD 4 */}
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h3 className="text-sm text-gray-500">Tickets</h3>
            <p className="text-2xl font-bold text-red-500 mt-2">2</p>
          </div>

        </div>

        {/* RECENT BOOKINGS TABLE */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Bookings
          </h3>

          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 border-b">
                <th className="py-2">Resource</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Conference Room A</td>
                <td>2026-04-20</td>
                <td className="text-green-600 font-medium">Approved</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">Lab 2</td>
                <td>2026-04-18</td>
                <td className="text-yellow-500 font-medium">Pending</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3">Auditorium</td>
                <td>2026-04-15</td>
                <td className="text-red-500 font-medium">Rejected</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RECENT TICKETS TABLE */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Tickets
          </h3>

          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50">
              <tr className="text-gray-500 border-b">
                <th className="py-2">Ticket ID</th>
                <th className="py-2">Subject</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">#T001</td>
                <td>Projector not working</td>
                <td>2026-04-21</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600 font-medium">
                    Open
                  </span>
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">#T002</td>
                <td>Room booking issue</td>
                <td>2026-04-19</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                    Resolved
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 font-medium">#T003</td>
                <td>AC not functioning</td>
                <td>2026-04-17</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-500 font-medium">
                    Closed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}

export default UserDashboard;