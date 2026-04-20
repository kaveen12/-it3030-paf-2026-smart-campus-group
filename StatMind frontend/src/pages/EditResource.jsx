// src/pages/EditResource.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditResource() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [resourceCode, setResourceCode] = useState("");

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

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setFetching(true);

      const response = await fetch(
        `http://localhost:8081/api/resources/${id}`
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      setFormData({
        name: data.name || "",
        type: data.type || "LECTURE_HALL",
        capacity: data.capacity || "",
        location: data.location || "",
        startDate: data.startDate || "",
        startTime: data.startTime || "",
        endDate: data.endDate || "",
        endTime: data.endTime || "",
        status: data.status || "ACTIVE",
        description: data.description || "",
      });

      setResourceCode(data.resourceCode || "");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load resource.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8081/api/resources/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            capacity: parseInt(formData.capacity) || 0,
          }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      alert("Resource updated successfully");
      navigate("/view");
    } catch (err) {
      console.error(err);
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="ml-64 pt-16 min-h-screen bg-gray-100">
        <div className="p-6 text-center text-gray-500">
          Loading resource...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* MAIN CONTENT */}
      <div className="ml-64 pt-4 min-h-screen">

        <div className="p-6">

          <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl">

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Edit Resource
            </h1>

            {/* RESOURCE CODE */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Resource Code:</span>
                <span className="ml-2 font-mono text-blue-700 font-bold">
                  {resourceCode}
                </span>
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* NAME */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Resource Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>

                {/* TYPE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="AUDITORIUM">Auditorium</option>
                    <option value="CLASSROOM">Classroom</option>
                    <option value="CONFERENCE_ROOM">Conference Room</option>
                  </select>
                </div>

                {/* CAPACITY */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Capacity
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                {/* START DATE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* START TIME */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* END DATE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* END TIME */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>

                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Resource"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/view")}
                  className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EditResource;