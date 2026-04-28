<div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
  <UserNavbar />

  <main className="ml-56 mt-14 flex-1 py-10 px-6">
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Welcome, {userName}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here’s your activity overview
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

        <div className="px-8 pb-8">
          <div className="-mt-10 mb-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {getInitials(userName)}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-400">Registered User</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-5 mt-6">

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
              <p className="text-xl font-bold text-gray-800">{counts.total}</p>
              <p className="text-xs text-gray-400 mt-1">Total</p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow-md transition">
              <p className="text-xl font-bold text-green-600">{counts.approved}</p>
              <p className="text-xs text-green-400 mt-1">Approved</p>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:shadow-md transition">
              <p className="text-xl font-bold text-yellow-600">{counts.pending}</p>
              <p className="text-xs text-yellow-500 mt-1">Pending</p>
            </div>

            <div className="p-4 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition">
              <p className="text-xl font-bold text-red-500">{counts.rejected}</p>
              <p className="text-xs text-red-400 mt-1">Rejected</p>
            </div>

          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6">

        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.03] transition duration-200 text-left">
          <p className="font-semibold">Make Booking</p>
          <p className="text-xs opacity-80">Create a new reservation</p>
        </button>

        <button className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-50 transition text-left border border-gray-100">
          <p className="font-semibold text-gray-800">View Bookings</p>
          <p className="text-xs text-gray-400">Check your history</p>
        </button>

        <button className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg hover:bg-gray-50 transition text-left border border-gray-100">
          <p className="font-semibold text-gray-800">Profile Settings</p>
          <p className="text-xs text-gray-400">Update your details</p>
        </button>

      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
          Recent Bookings
        </h3>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400 text-sm">No bookings yet</p>
        ) : (
          <div className="divide-y">
            {bookings.slice(0, 3).map((b, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {b.service || "Service"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {b.date || "No date"}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold
                    ${
                      b.status === "APPROVED"
                        ? "bg-green-100 text-green-600"
                        : b.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-500"
                    }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  </main>
</div>