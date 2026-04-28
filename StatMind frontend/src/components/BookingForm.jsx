import React, { useState, useEffect } from "react";
import axios from "axios";
import { createBooking } from "../api/bookingApi";

function BookingForm() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const errors = {};

    if (!form.userName.trim())
      errors.userName = "User Name is required.";

    if (!form.resourceCode)
      errors.resourceCode = "Please select a resource.";

    if (!form.date) {
      errors.date = "Date is required.";
    } else if (form.date < today) {
      errors.date = "Date cannot be in the past.";
    }

    if (!form.startTime)
      errors.startTime = "Start time is required.";

    if (!form.endTime) {
      errors.endTime = "End time is required.";
    } else if (form.startTime && form.endTime <= form.startTime) {
      errors.endTime = "End time must be after start time.";
    }

    if (!form.purpose.trim())
      errors.purpose = "Purpose is required.";

    if (!form.attendees && form.attendees !== 0) {
      errors.attendees = "Number of attendees is required.";
    } else if (parseInt(form.attendees) < 1) {
      errors.attendees = "Attendees must be at least 1.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
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
    if (validationErrors.resourceCode) {
      setValidationErrors(prev => ({ ...prev, resourceCode: "" }));
    }
  };

  const formatTime = (t) => (t && t.length === 5 ? t + ":00" : t);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

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
      setValidationErrors({});
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

  const inputBase =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const inputError =
    "w-full rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-300 transition focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100";

  const readOnlyInput =
    "w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed";

  const labelBase =
    "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2";

  const sectionLabel =
    "text-xs font-extrabold uppercase tracking-widest text-gray-600 text-center mb-5";

  const fieldClass = (name) =>
    validationErrors[name] ? inputError : inputBase;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Booking
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1">
            Fill in the details below to reserve a resource.
          </p>
        </div>

        {/* Server error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-500 rounded-2xl px-4 py-3 mb-5 text-sm">
            <span>✕</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-2 bg-green-50 border border-green-100 text-green-600 rounded-2xl px-4 py-3 mb-5 text-sm">
            <span>✓</span>
            <span>Booking request submitted successfully!</span>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-7" noValidate>

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
                    className={fieldClass("userId")}
                  />
                  {validationErrors.userId && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.userId}</p>
                  )}
                </div>
                <div>
                  <label className={labelBase}>User Name</label>
                  <input
                    type="text"
                    name="userName"
                    placeholder="Full name"
                    value={form.userName}
                    onChange={handleChange}
                    className={fieldClass("userName")}
                  />
                  {validationErrors.userName && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.userName}</p>
                  )}
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
                  className={fieldClass("resourceCode")}
                >
                  <option value="">Choose a resource…</option>
                  {resources.map(r => (
                    <option key={r.id} value={r.resourceCode}>
                      {r.name} ({r.resourceCode})
                    </option>
                  ))}
                </select>
                {validationErrors.resourceCode && (
                  <p className="text-red-400 text-[11px] mt-1">{validationErrors.resourceCode}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Resource Name</label>
                  <input type="text" value={form.resourceName} placeholder="Auto-filled" readOnly className={readOnlyInput} />
                </div>
                <div>
                  <label className={labelBase}>Type</label>
                  <input type="text" value={form.type} placeholder="Auto-filled" readOnly className={readOnlyInput} />
                </div>
                <div>
                  <label className={labelBase}>Location</label>
                  <input type="text" value={form.location} placeholder="Auto-filled" readOnly className={readOnlyInput} />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SCHEDULE */}
            <div>
              <p className={sectionLabel}>Schedule</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelBase}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    min={today}
                    onChange={handleChange}
                    className={fieldClass("date")}
                  />
                  {validationErrors.date && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className={labelBase}>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className={fieldClass("startTime")}
                  />
                  {validationErrors.startTime && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.startTime}</p>
                  )}
                </div>
                <div>
                  <label className={labelBase}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className={fieldClass("endTime")}
                  />
                  {validationErrors.endTime && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.endTime}</p>
                  )}
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
                    className={fieldClass("purpose")}
                  />
                  {validationErrors.purpose && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.purpose}</p>
                  )}
                </div>
                <div>
                  <label className={labelBase}>Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    placeholder="0"
                    min="1"
                    value={form.attendees}
                    onChange={handleChange}
                    className={fieldClass("attendees")}
                  />
                  {validationErrors.attendees && (
                    <p className="text-red-400 text-[11px] mt-1">{validationErrors.attendees}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
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