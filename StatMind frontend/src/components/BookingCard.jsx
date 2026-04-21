import React from "react";

function BookingCard({ booking, onStatusChange }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "10px",
        borderRadius: "5px"
      }}
    >
      <p><b>{booking.bookingId}</b></p>
      <p>Resource: {booking.resourceCode}</p>
      <p>User: {booking.userId}</p>
      <p>Date: {booking.date}</p>
      <p>Time: {booking.startTime} - {booking.endTime}</p>
      <p>Purpose: {booking.purpose}</p>
      <p>Attendees: {booking.attendees}</p>

      <p>
        Status: <b>{booking.status}</b>
      </p>

      {booking.status === "REJECTED" && (
        <p style={{ color: "red" }}>
          Reason: {booking.rejectionReason}
        </p>
      )}

      {/* ✅ FIXED ID */}
      <select
        defaultValue=""
        onChange={(e) =>
          onStatusChange(booking.id, e.target.value)
        }
      >
        <option value="" disabled>
          Update Status
        </option>
        <option value="APPROVED">Approve</option>
        <option value="REJECTED">Reject</option>
      </select>
    </div>
  );
}

export default BookingCard;