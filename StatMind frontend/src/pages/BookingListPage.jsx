import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getAllBookings,
  approveBooking,
  rejectBooking
} from "../api/bookingApi";

import BookingCard from "../components/BookingCard";
import AdminNavbar from "../components/adminnav";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("❌ Fetch bookings error:", err);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ FIXED: now accepts reason from child
  const handleStatusChange = async (id, value, reason = null) => {
    try {
      const booking = bookings.find(
        b => b.id === id || b.bookingId === id
      );

      if (!booking) {
        console.error("❌ Booking not found:", id);
        alert("Booking not found");
        return;
      }

      if (value === "APPROVED") {
        await approveBooking(id);

        await axios.post(
          "http://localhost:8081/api/notifications/booking-status",
          null,
          {
            params: {
              userId: booking.userId,
              status: "approved"
            }
          }
        );

      } else if (value === "REJECTED") {
        // ✅ NO prompt anymore
        if (!reason || !reason.trim()) {
          alert("Rejection reason is required");
          return;
        }

        await rejectBooking(id, reason);

        await axios.post(
          "http://localhost:8081/api/notifications/booking-status",
          null,
          {
            params: {
              userId: booking.userId,
              status: "rejected"
            }
          }
        );
      }

      // refresh list
      await fetchBookings();

    } catch (err) {
      console.error("❌ Status update error:", err);
      alert("Error updating booking status");
    }
  };

  // stats
  const total = bookings.length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

  // filtering + search
  const filteredBookings = bookings
    .filter(b => selectedFilter === "ALL" || b.status === selectedFilter)
    .filter(b => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const bookingId = (b.bookingId || b.bookingCode || b.id || "")
        .toString()
        .toLowerCase();

      return bookingId.includes(q);
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="ml-56 mt-14 flex-1 py-8 px-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          All Bookings
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-5xl mx-auto">
          <StatCard label="Total" value={total} />
          <StatCard label="Approved" value={approved} color="green" />
          <StatCard label="Rejected" value={rejected} color="red" />
          <StatCard label="Cancelled" value={cancelled} color="yellow" />
        </div>

        {/* Search + Filter */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by Booking ID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 rounded-xl border"
          />

          <div className="flex flex-wrap gap-2">
            {["ALL", "APPROVED", "REJECTED", "CANCELLED"].map(status => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold ${
                  selectedFilter === status
                    ? "bg-black text-white"
                    : "bg-white border"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-gray-400">
            {filteredBookings.length} result
            {filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No bookings found
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBookings.map(b => (
              <BookingCard
                key={b.bookingId || b.id}
                booking={b}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// reusable stat card
function StatCard({ label, value, color }) {
  const colors = {
    green: "text-green-600 bg-green-50",
    red: "text-red-500 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50"
  };

  return (
    <div className={`rounded-xl p-4 text-center border ${colors[color] || "bg-white"}`}>
      <p className="text-xs font-bold uppercase">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

export default BookingListPage;