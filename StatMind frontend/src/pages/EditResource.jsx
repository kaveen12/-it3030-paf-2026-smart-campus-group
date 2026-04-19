// src/pages/EditResource.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditResource() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get resource ID from URL
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  
  // Form data state
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
  
  const [resourceCode, setResourceCode] = useState("");

  // Fetch resource data when component loads
  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setFetching(true);
      const response = await fetch(`http://localhost:8081/api/resources/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resource');
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
        description: data.description || ""
      });
      
      setResourceCode(data.resourceCode);
      setError(null);
    } catch (err) {
      console.error("Error fetching resource:", err);
      setError("Failed to load resource data. Make sure backend is running.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!formData.name) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    
    const submitData = {
      ...formData,
      capacity: parseInt(formData.capacity) || 0
    };
    
    try {
      const response = await fetch(`http://localhost:8081/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      alert("Resource updated successfully!");
      navigate("/view");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to update resource. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading resource data...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      
      {/* Display Resource Code (Read-only) */}
      <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Resource Code:</span> 
          <span className="ml-2 text-blue-700 font-mono font-bold">{resourceCode}</span>
          <span className="ml-2 text-xs text-gray-500">(Auto-generated, cannot be edited)</span>
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={fetchResource} className="ml-4 text-sm underline">
            Retry
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          {/* Name - Required */}
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
              placeholder="e.g., Main Lecture Hall, Computer Lab 1"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="AUDITORIUM">Auditorium</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="CONFERENCE_ROOM">Conference Room</option>
            </select>
          </div>
          
          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Number of seats"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Building, Floor, Room"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Available From (Date)</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Available From (Time)</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* End Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Available Until (Date)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* End Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Available Until (Time)</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional details about the resource (e.g., equipment, special features)..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Updating..." : "Update Resource"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/view")}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditResource;