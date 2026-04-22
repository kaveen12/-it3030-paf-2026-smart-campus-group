// src/pages/AddResource.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource, uploadCSV } from "../api/resourceApi";

function AddResource() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [csvFile, setCsvFile] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
      };

      const result = await createResource(submitData);

      alert(`Resource Created! Code: ${result.resourceCode}`);
      navigate("/view");
    } catch {
      setError("Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

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
    } catch {
      alert("CSV Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-16 left-64 right-0 bottom-0 bg-slate-100 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow border p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Resource
          </h1>
          <p className="text-gray-500 mt-2">
            Create single resource or upload CSV file for bulk creation
          </p>
        </div>

        {/* CSV Upload Card */}
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

            <button className="text-blue-600 hover:underline text-sm font-medium">
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
              onClick={handleUploadCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              Upload CSV
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow border p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Manual Resource Entry
          </h2>

          <div className="grid grid-cols-2 gap-5">

            {/* Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Resource Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Type */}
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
            </div>

            {/* Capacity */}
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
            </div>

            {/* Location */}
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
            </div>

            {/* Status */}
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
            </div>

            {/* Start Date */}
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
            </div>

            {/* Start Time */}
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
            </div>

            {/* End Date */}
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
            </div>

            {/* End Time */}
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
            </div>

          </div>

          {/* Description */}
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

          {/* Buttons */}
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
              onClick={() => navigate("/view")}
              className="border px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddResource;