// src/pages/AddResource.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource, uploadCSV } from "../api/resourceApi";
import Navbar from "../components/ResourceNavbar";

function AddResource() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "ACTIVE",
    description: "",
  });

  // ================= VALIDATE SINGLE FIELD =================
  const validateField = (name, value) => {
  const today = new Date().toISOString().split("T")[0];
  let msg = "";

  // Required fields (description only optional)
  if (name !== "description") {
    if (!value || value === "") {
      msg = "This field is required";
    }
  }

  // Type default check
  if (name === "type" && value === "LECTURE_HALL") {
    msg = "This field is required";
  }

  // Status default check
  // Status validation (only check empty)
if (name === "status") {
  if (!value) {
    msg = "This field is required";
  }
}

  // Capacity
  if (name === "capacity") {
    if (value && Number(value) <= 0) {
      msg = "Capacity must be greater than 0";
    }
  }

  // Start Date
  if (name === "startDate") {
    if (value && value < today) {
      msg = "Start date must be today or future";
    }
  }

  // End Date
  if (name === "endDate") {
    if (value && formData.startDate && value < formData.startDate) {
      msg = "End date must be after start date";
    }
  }

  return msg;
};

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // ================= VALIDATE FORM =================
  const validateForm = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) {
        newErrors[key] = err;
      }
    });

    setFieldErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
      };

      const result = await createResource(submitData);

      alert(`Resource Created! Code: ${result.resourceCode}`);
      navigate("/viewResource");
    } catch (err) {
      setError("Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  // ================= CSV =================
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUploadCSV = async () => {
    if (!csvFile) {
      alert("Please select CSV file");
      return;
    }

    try {
      setLoading(true);
      await uploadCSV(csvFile);

      alert("CSV Uploaded Successfully!");
      navigate("/view");
    } catch (err) {
      alert("CSV Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
    <Navbar />

   <div className="ml-56 mt-14 min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Resource
          </h1>
          <p className="text-gray-500 mt-2">
            Create single resource or upload CSV file for bulk creation
          </p>
        </div>

        {/* CSV UPLOAD */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Bulk CSV Upload
              </h2>
              <p className="text-sm text-gray-500">
                Required fields: name, type, capacity, location, status
              </p>
            </div>

            <button
              type="button"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Download Template
            </button>
          </div>

          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mb-3"
            />

            {csvFile && (
              <p className="text-green-600 font-semibold">
                {csvFile.name}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-2">
              Upload CSV file to create multiple resources instantly
            </p>
          </div>

          <div className="mt-5 text-right">
            <button
              type="button"
              onClick={handleUploadCSV}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Upload CSV
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Manual Resource Entry
          </h2>

          <div className="grid grid-cols-2 gap-5">

            {/* NAME */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Resource Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* TYPE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="PROJECTOR">Projector</option>
                <option value="CAMERA">Camera</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
              {fieldErrors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.type}
                </p>
              )}
            </div>

            {/* CAPACITY */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.capacity && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.capacity}
                </p>
              )}
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.location}
                </p>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
               {fieldErrors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.status}
                </p>
              )}
            </div>

            {/* START DATE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.startDate}
                </p>
              )}
            </div>

            {/* START TIME */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.startTime && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.startTime}
                </p>
              )}
            </div>

            {/* END DATE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.endDate}
                </p>
              )}
            </div>

            {/* END TIME */}
            <div>
              <label className="block text-sm font-medium mb-2">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              {fieldErrors.endTime && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.endTime}
                </p>
              )}
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-5">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              {loading ? "Creating..." : "Create Resource"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/viewResource")}
              className="border px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
    </>
  );
}

export default AddResource;