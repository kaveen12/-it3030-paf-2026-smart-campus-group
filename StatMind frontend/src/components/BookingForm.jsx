import React, { useState, useEffect } from "react";
import axios from "axios";
import { createBooking } from "../api/bookingApi";

function BookingForm() {

  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    resourceCode: "",
    resourceName: "",
    type: "",
    location: "",
    userId: "",
    userName: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: ""
  });
//************************ */
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setForm(prev => ({
      ...prev,
      userId: storedUser.userId,
      userName: storedUser.userName
    }));
  }
  }, []);

  // Load resources
  useEffect(() => {
    axios.get("http://localhost:8081/api/resources")
      .then(res => setResources(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleResourceChange = (e) => {

    const selectedCode = e.target.value;

    const selectedResource = resources.find(
      r => r.resourceCode === selectedCode
    );

    setForm({
      ...form,
      resourceCode: selectedCode,
      resourceName: selectedResource?.name || "",
      type: selectedResource?.type || "",
      location: selectedResource?.location || ""
    });
  };

  const formatTime = (t) => (t && t.length === 5 ? t + ":00" : t);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    const payload = {
      resourceCode: form.resourceCode,
      userId: form.userId,
      date: form.date,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime),
      purpose: form.purpose,
      attendees: parseInt(form.attendees || 0)
    };

    try {

      await createBooking(payload);

      alert("✅ Booking request submitted!");

      setForm({
        resourceCode: "",
        resourceName: "",
        type: "",
        location: "",
        userId: "",
        userName: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
        attendees: ""
      });

    } catch (err) {

      let message = "Time slot already booked";

      if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
    }
  };

  return (
    <div>
      <h2>Create Booking</h2>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#b30000",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px"
          }}
        >
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={form.userId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={form.userName}
          onChange={handleChange}
          required
        />

        <select
          value={form.resourceCode}
          onChange={handleResourceChange}
          required
        >
          <option value="">Select Resource</option>

          {resources.map(r => (
            <option key={r.id} value={r.resourceCode}>
              {r.name} ({r.resourceCode})
            </option>
          ))}

        </select>

        <input
          type="text"
          value={form.resourceName}
          placeholder="Resource Name"
          readOnly
        />

        <input
          type="text"
          value={form.type}
          placeholder="Type"
          readOnly
        />

        <input
          type="text"
          value={form.location}
          placeholder="Location"
          readOnly
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
        />

        <input
          type="number"
          name="attendees"
          placeholder="Attendees"
          value={form.attendees}
          onChange={handleChange}
        />

        <button type="submit">Book</button>

      </form>
    </div>
  );
}

export default BookingForm;