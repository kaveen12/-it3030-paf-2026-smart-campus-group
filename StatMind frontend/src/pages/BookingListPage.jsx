import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking
} from "../api/bookingApi";

import BookingCard from "../components/BookingCard";
import AdminNavbar from "../components/AdminNavbar";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  const total = bookings.length;
  const approved = bookings.filter(b => b.status === "APPROVED").length;
  const rejected = bookings.filter(b => b.status === "REJECTED").length;
  const cancelled = bookings.filter(b => b.status === "CANCELLED").length;

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

      {/* Sidebar + Top header */}
      <AdminNavbar />

      {/* Main content — ml-56 clears sidebar, mt-14 clears top header */}
      <main className="ml-56 mt-14 flex-1 py-8 px-6">

        {/* Page Title */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          All Bookings
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-5xl mx-auto">
          <div className="bg-white shadow-sm rounded-2xl p-6 text-center border border-gray-200">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total</p>
            <h3 className="text-3xl font-extrabold text-gray-800">{total}</h3>
          </div>
          <div className="bg-green-50 shadow-sm rounded-2xl p-6 text-center border border-green-100">
            <p className="text-green-500 text-xs font-bold uppercase tracking-widest mb-1">Approved</p>
            <h3 className="text-3xl font-extrabold text-green-600">{approved}</h3>
          </div>
          <div className="bg-red-50 shadow-sm rounded-2xl p-6 text-center border border-red-100">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Rejected</p>
            <h3 className="text-3xl font-extrabold text-red-500">{rejected}</h3>
          </div>
          <div className="bg-yellow-50 shadow-sm rounded-2xl p-6 text-center border border-yellow-100">
            <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1">Cancelled</p>
            <h3 className="text-3xl font-extrabold text-yellow-600">{cancelled}</h3>
          </div>
        </div>

        {/* Search + Filter Row */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 mb-8">

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by Booking ID…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 placeholder-gray-300 shadow-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["ALL", "APPROVED", "REJECTED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                  selectedFilter === status
                    ? "bg-gray-900 text-white shadow"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Result count */}
          <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
            {filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* No results */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-sm font-semibold">No bookings found</p>
            <p className="text-xs mt-1">Try a different filter or search term.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredBookings.map((b) => (
              <BookingCard
                key={b.bookingId}
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

export default BookingListPage;