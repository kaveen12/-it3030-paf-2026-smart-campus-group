import React, { useState, useEffect } from "react";
import axios from "axios";
import { createBooking } from "../api/bookingApi";

function BookingForm() {
  const [resources, setResources] = useState([]);

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

  // 🔹 Load resources from backend
  useEffect(() => {
    axios.get("http://localhost:8081/api/resources")
      .then(res => setResources(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔹 Handle normal input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 Handle resource selection + auto-fill
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

  // 🔹 Fix time format (HH:mm → HH:mm:ss)
  const formatTime = (t) => (t && t.length === 5 ? t + ":00" : t);

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      resourceCode: form.resourceCode,
      userId: form.userId,
      date: form.date,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime),
      purpose: form.purpose,
      attendees: parseInt(form.attendees || 0)
    };

    console.log("Sending:", payload);

    try {
      await createBooking(payload);
      alert("✅ Booking request submitted!");

      // Reset form
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
      console.error("ERROR:", err);
      console.error("BACKEND RESPONSE:", err.response?.data);
      alert(err.response?.data || "❌ Error creating booking");
    }
  };

  return (
    <div>
      <h2>Create Booking</h2>

      <form onSubmit={handleSubmit}>

        {/* USER DETAILS */}
        <input
          type="text"
          name="userId"
          placeholder="User ID (e.g., USER007)"
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

        {/* RESOURCE DROPDOWN */}
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

        {/* AUTO-FILLED RESOURCE DETAILS */}
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

        {/* DATE */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        {/* TIME */}
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

        {/* OTHER DETAILS */}
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