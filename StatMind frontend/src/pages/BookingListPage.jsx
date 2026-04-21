import React, { useEffect, useState } from "react";
import {
  getAllBookings,
  approveBooking,
  rejectBooking
} from "../api/bookingApi";

import BookingCard from "../components/BookingCard";

function BookingListPage() {
  const [bookings, setBookings] = useState([]);

  // 🔹 Load bookings
  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();

      // ✅ FIX: res is already the array
      setBookings(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔹 Handle status change
  const handleStatusChange = async (id, value) => {
    try {
      if (value === "APPROVED") {
        await approveBooking(id);
      } else if (value === "REJECTED") {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        await rejectBooking(id, reason);
      }

      fetchBookings(); // refresh list
    } catch (err) {
      console.error(err);
      alert("❌ Error updating status");
    }
  };

  return (
    <div>
      <h2>All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <BookingCard
            key={b.bookingId}   // ✅ FIXED
            booking={b}
            onStatusChange={handleStatusChange}
          />
        ))
      )}
    </div>
  );
}

export default BookingListPage;