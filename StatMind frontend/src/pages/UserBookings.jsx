import React, { useEffect, useState } from "react";
import axios from "axios";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  // 🔹 Get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    setUser(storedUser);
    fetchBookings(storedUser.userId);
  }, []);

  // 🔹 Fetch bookings
  const fetchBookings = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/bookings/user/${userId}`
      );
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel booking?")) return;

    try {
      await axios.put(
        `http://localhost:8081/api/bookings/${id}/cancel`
      );

      alert("Cancelled!");
      fetchBookings(user.userId);

    } catch (err) {
      alert("Cancel failed");
    }
  };

  return (
    <div>
      <h2>My Bookings ({user?.userName})</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.resourceCode}</td>
              <td>{b.date}</td>
              <td>{b.startTime} - {b.endTime}</td>
              <td>{b.status}</td>

              <td>
                {(b.status === "PENDING" || b.status === "APPROVED") && (
                  <button onClick={() => handleCancel(b.id)}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserBookings;