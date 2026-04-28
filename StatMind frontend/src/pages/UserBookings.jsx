import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "../components/usernav";
import { getSessionUser } from "../utils/sessionUser";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser.userId) {
      setUserId(sessionUser.userId);
      setUserName(sessionUser.userName || "");
      fetchBookings(sessionUser.userId);
    }
  }, []);

  const fetchBookings = (uid) => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/api/bookings/user/${uid}`)
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleCancelBooking = (bookingId) => {
    setCancellingId(bookingId);
    axios
      .put(`http://localhost:8081/api/bookings/${bookingId}/cancel`)
      .then(() => {
        setBookings((prev) =>
          prev.map((b) =>
            (b._id || b.id) === bookingId ? { ...b, status: "CANCELLED" } : b
          )
        );
        setCancellingId(null);
        setConfirmId(null);
      })
      .catch((err) => {
        console.error(err);
        setCancellingId(null);
        setConfirmId(null);
        alert("Failed to cancel booking. Please try again.");
      });
  };

  const handleDeleteBooking = (bookingId) => {
    // Optimistic cache update
    setBookings((prev) => prev.filter((b) => (b._id || b.id) !== bookingId));

    axios
      .delete(`http://localhost:8081/api/bookings/${bookingId}`)
      .catch((err) => {
        console.error(err);
        alert("Failed to delete booking. It might be already removed.");
        if (userId) fetchBookings(userId);
      });
  };

  const filters = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

  const filtered =
    filter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status?.toUpperCase() === filter);

  const counts = {
    total: bookings.length,
    approved: bookings.filter((b) => b.status?.toUpperCase() === "APPROVED").length,
    pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING").length,
    rejected: bookings.filter((b) => b.status?.toUpperCase() === "REJECTED").length,
    cancelled: bookings.filter((b) => b.status?.toUpperCase() === "CANCELLED").length,
  };

  const statusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return {
          badge: "bg-green-50 text-green-600 border border-green-200",
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          badge: "bg-amber-50 text-amber-600 border border-amber-200",
          dot: "bg-amber-400",
        };
      case "REJECTED":
        return {
          badge: "bg-red-50 text-red-500 border border-red-200",
          dot: "bg-red-500",
        };
      case "CANCELLED":
        return {
          badge: "bg-gray-100 text-gray-500 border border-gray-200",
          dot: "bg-gray-400",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-500 border border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserNavbar />

      <main className="ml-56 mt-14 flex-1 py-10 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Bookings</h1>
            <p className="text-sm text-gray-400 mt-1">
              {userName
                ? `Welcome, ${userName} — all your booking requests in one place`
                : "All your booking requests in one place"}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-800">{counts.total}</p>
            </div>
            <div className="bg-green-50 rounded-2xl border border-green-100 shadow-sm p-5 text-center">
              <p className="text-xs text-green-500 uppercase tracking-widest mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{counts.approved}</p>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-5 text-center">
              <p className="text-xs text-red-400 uppercase tracking-widest mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-500">{counts.rejected}</p>
            </div>
            <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-5 text-center">
              <p className="text-xs text-amber-500 uppercase tracking-widest mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-500">{counts.pending}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  filter === f
                    ? "bg-gray-900 text-white shadow"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-24">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs mt-1">Try a different filter or create a new booking.</p>
            </div>
          )}

          {/* Booking Cards Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((b) => {
                const bookingId = b._id || b.id;
                const { badge, dot } = statusStyle(b.status);
                const isApproved = b.status?.toUpperCase() === "APPROVED";
                const isPending  = b.status?.toUpperCase() === "PENDING";
                const isRejected = b.status?.toUpperCase() === "REJECTED";
                const isCancelled = b.status?.toUpperCase() === "CANCELLED";
                const isCancelling = cancellingId === bookingId;
                const isConfirming = confirmId === bookingId;

                return (
                  <div
                    key={bookingId}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-gray-400 font-medium tracking-wider">
                          #{b.bookingId }
                        </p>
                        <p className="text-base font-bold text-gray-800 mt-0.5">
                          {b.purpose || "—"}
                        </p>
                      </div>

                      {/* ✅ Status badge — no delete button in header anymore */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${badge}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* Resource badge */}
                    <div className="px-5 pb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {b.resourceCode || "N/A"}
                      </span>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Meta grid */}
                    <div className="px-5 py-4 grid grid-cols-2 gap-y-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">User</p>
                        <p className="text-xs font-semibold text-gray-700">{b.userName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Attendees</p>
                        <p className="text-xs font-semibold text-gray-700">{b.attendees ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Date</p>
                        <p className="text-xs font-semibold text-gray-700">{b.date || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Time</p>
                        <p className="text-xs font-semibold text-gray-700">
                          {b.startTime && b.endTime
                            ? `${b.startTime} – ${b.endTime}`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {/* ── APPROVED: cancel button with inline confirm ── */}
                    {isApproved && (
                      <div className="px-5 pb-5">
                        <p className="text-xs text-green-500 font-medium mb-3">
                          ✓ This booking has been approved
                        </p>

                        {isConfirming ? (
                          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-3">
                            <p className="text-xs text-red-600 font-medium mb-2">
                              Are you sure you want to cancel this booking?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancelBooking(bookingId)}
                                disabled={isCancelling}
                                className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                              >
                                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                disabled={isCancelling}
                                className="flex-1 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:border-gray-400 transition-colors disabled:opacity-60"
                              >
                                Keep It
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(bookingId)}
                            className="w-full py-2 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    )}

                    {/* Rejection reason */}
                    {isRejected && b.rejectionReason && (
                      <div className="mx-5 mb-4 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        <p className="text-[9px] uppercase tracking-widest text-red-400 mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-xs text-red-600">{b.rejectionReason}</p>
                      </div>
                    )}

                    {/* Footer area for non-approved statuses */}
                    <div className="px-5 pb-5">

                      {/* Pending notice + delete */}
                      {isPending && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-amber-500 font-medium">
                            ⏳ Awaiting admin approval
                          </p>
                          {/* ✅ Delete only for PENDING */}
                          <button
                            onClick={() => handleDeleteBooking(bookingId)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Booking"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Rejected notice + delete */}
                      {isRejected && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-red-400 font-medium">
                            ✕ This booking was rejected
                          </p>
                          {/* ✅ Delete only for REJECTED */}
                          <button
                            onClick={() => handleDeleteBooking(bookingId)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Booking"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Cancelled notice + delete */}
                      {isCancelled && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 font-medium">
                            ✕ This booking has been cancelled
                          </p>
                          {/* ✅ Delete only for CANCELLED */}
                          <button
                            onClick={() => handleDeleteBooking(bookingId)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Delete Booking"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyBookings;