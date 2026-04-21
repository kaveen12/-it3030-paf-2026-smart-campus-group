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
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // =========================
  // CREATE SINGLE RESOURCE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0
      };

      const result = await createResource(submitData);

      alert(`Resource created! Code: ${result.resourceCode}`);
      navigate("/view");

    } catch (err) {
      setError("Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CSV HANDLERS
  // =========================
  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUploadCSV = async () => {
    if (!csvFile) {
      alert("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);

      await uploadCSV(csvFile);

      alert("CSV uploaded successfully!");
      navigate("/view");

    } catch (err) {
      console.error(err);
      alert("CSV upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-6">

      <div className="w-full max-w-5xl ml-28">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Create New Resource
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Add manually or upload CSV to create multiple resources
        </p>

        {/* =========================
            CSV UPLOAD CARD
        ========================== */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg">Bulk Import via CSV</h2>
              <p className="text-sm text-gray-500">
                Required: name, type, capacity, location, status
              </p>
            </div>

            <a className="text-blue-600 underline text-sm">
              Download Template
            </a>
          </div>

          {/* FILE UPLOAD */}
          <div className="border-2 border-dashed p-6 text-center rounded-lg">

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />

            {csvFile && (
              <p className="mt-2 text-green-600 font-semibold">
                {csvFile.name}
              </p>
            )}

          </div>

          <div className="mt-4 text-right">
            <button
              onClick={handleUploadCSV}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Upload CSV
            </button>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* =========================
            MANUAL FORM
        ========================== */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">

          <div className="grid grid-cols-2 gap-4">

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* FIXED TYPE OPTIONS */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
  name="type"
  value={formData.type}
  onChange={handleChange}
  className="w-full border p-2 rounded"
>
  <option value="LECTURE_HALL">Lecture Hall</option>
  <option value="LAB">Lab</option>
  <option value="MEETING_ROOM">Meeting Room</option>
  <option value="PROJECTOR">Projector</option>
  <option value="CAMERA">Camera</option>
  <option value="EQUIPMENT">Equipment</option>
</select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/view")}
              className="border px-4 py-2 rounded"
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