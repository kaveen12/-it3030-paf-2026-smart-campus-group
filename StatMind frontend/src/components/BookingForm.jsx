import React, { useState, useEffect } from "react";
import axios from "axios";
import { createBooking } from "../api/bookingApi";

function BookingForm() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    axios.get("http://localhost:8081/api/resources")
      .then(res => setResources(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResourceChange = (e) => {
    const selectedCode = e.target.value;
    const selectedResource = resources.find(r => r.resourceCode === selectedCode);
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
    setSuccess(false);

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
      setSuccess(true);
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

  // Matches exactly: white bg inputs, light gray border, blue focus — same as booking cards
  const inputBase =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const readOnlyInput =
    "w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed";

  // Matches "USER", "ATTENDEES", "DATE", "TIME" label style in the booking cards
  const labelBase =
    "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2";

  // Matches section dividers — same small-caps gray style as card meta
  const sectionLabel =
    "text-xs font-extrabold uppercase tracking-widest text-gray-600 text-center mb-5";

  return (
    // bg-gray-50 — same page background as All Bookings
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Page title — matches "All Bookings" heading exactly */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Booking
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Fill in the details below to reserve a resource.
          </p>
        </div>

        {/* Alerts — match the APPROVED/REJECTED card badge colors */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-500 rounded-2xl px-4 py-3 mb-5 text-sm">
            <span>✕</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-100 text-green-600 rounded-2xl px-4 py-3 mb-5 text-sm">
            <span>✓</span>
            <span>Booking request submitted successfully!</span>
          </div>
        )}

        {/* Main card — white, rounded-2xl, light border + shadow, same as booking cards */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <form onSubmit={handleSubmit} className="p-8 space-y-7">

            {/* USER INFORMATION */}
            <div>
              <p className={sectionLabel}>User Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    placeholder="e.g. USR-001"
                    value={form.userId}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>User Name</label>
                  <input
                    type="text"
                    name="userName"
                    placeholder="Full name"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* RESOURCE */}
            <div>
              <p className={sectionLabel}>Resource</p>
              <div className="mb-4">
                <label className={labelBase}>Select Resource</label>
                <select
                  value={form.resourceCode}
                  onChange={handleResourceChange}
                  required
                  className={inputBase}
                >
                  <option value="">Choose a resource…</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.resourceCode}>
                      {r.name} ({r.resourceCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Resource Name</label>
                  <input
                    type="text"
                    value={form.resourceName}
                    placeholder="Auto-filled"
                    readOnly
                    className={readOnlyInput}
                  />
                </div>
                <div>
                  <label className={labelBase}>Type</label>
                  <input
                    type="text"
                    value={form.type}
                    placeholder="Auto-filled"
                    readOnly
                    className={readOnlyInput}
                  />
                </div>
                <div>
                  <label className={labelBase}>Location</label>
                  <input
                    type="text"
                    value={form.location}
                    placeholder="Auto-filled"
                    readOnly
                    className={readOnlyInput}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SCHEDULE — matches DATE / TIME label style in cards */}
            <div>
              <p className={sectionLabel}>Schedule</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* DETAILS */}
            <div>
              <p className={sectionLabel}>Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    placeholder="e.g. Lecture"
                    value={form.purpose}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    placeholder="0"
                    min="0"
                    value={form.attendees}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Submit — matches the dark "ALL" active filter pill from the page */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full rounded-xl bg-gray-900 hover:bg-gray-700 active:scale-[0.98] text-white font-semibold text-sm py-3 px-6 transition-all duration-150 tracking-wide"
              >
                Confirm Booking
              </button>
            </div>

          </form>
        </div>

        <p className="text-center text-xs text-gray-300 mt-5">
          Bookings are subject to availability and admin approval.
        </p>
      </div>
    </div>
  );
}

export default BookingForm;