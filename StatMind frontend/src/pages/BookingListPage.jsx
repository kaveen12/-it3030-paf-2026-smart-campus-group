import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking
} from "../api/bookingApi";

import BookingCard from "../components/BookingCard";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL"); // ✅ NEW

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, value) => {
    try {
      if (value === "APPROVED") {
        await approveBooking(id);
      } else if (value === "REJECTED") {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        await rejectBooking(id, reason);
      }

      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating status");
    }
  };

  // ✅ Stats
  const total = bookings.length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

  // ✅ Filter logic
  const filteredBookings =
    selectedFilter === "ALL"
      ? bookings
      : bookings.filter(b => b.status === selectedFilter);

  return (
    <div className="w-full h-full py-6">

      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        All Bookings
      </h2>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center border">
          <p className="text-gray-500 text-sm">Total</p>
          <h3 className="text-2xl font-bold">{total}</h3>
        </div>

        <div className="bg-green-50 shadow-md rounded-2xl p-6 text-center border">
          <p className="text-green-600 text-sm">Approved</p>
          <h3 className="text-2xl font-bold text-green-700">{approved}</h3>
        </div>

        <div className="bg-red-50 shadow-md rounded-2xl p-6 text-center border">
          <p className="text-red-600 text-sm">Rejected</p>
          <h3 className="text-2xl font-bold text-red-700">{rejected}</h3>
        </div>

        <div className="bg-yellow-50 shadow-md rounded-2xl p-6 text-center border">
          <p className="text-yellow-600 text-sm">Cancelled</p>
          <h3 className="text-2xl font-bold text-yellow-700">{cancelled}</h3>
        </div>
      </div>

      {/* ✅ Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["ALL", "APPROVED", "REJECTED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition
              ${
                selectedFilter === status
                  ? "bg-[#0f172a] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500 text-center">
          No {selectedFilter.toLowerCase()} bookings found
        </p>
      ) : (
        <div
          className="
            w-full
            grid gap-8
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            grid-cols-[repeat(auto-fit,minmax(320px,1fr))]
          "
        >
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.bookingId}
              booking={b}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingListPage;