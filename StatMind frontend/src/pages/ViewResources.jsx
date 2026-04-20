// src/pages/ViewResources.jsx
import { useState, useEffect } from "react";
import {
  getAllResources,
  searchResources,
  deleteResource
} from "../api/resourceApi";
import SearchBar from "../components/SearchBar";

function ViewResources() {

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  // ✅ LOAD ALL
  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      console.error(err);
      setError("Load failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH (filters receive from SearchBar)
  const handleSearch = async (filters) => {
    console.log("Filters:", filters);

    setLoading(true);
    setError(null);

    try {
      const data = await searchResources(filters);
      setResources(data);
    } catch (err) {
  console.error("ERROR:", err.response || err);
  setError("Search failed");

    } finally {
      setLoading(false);
    }
  };

  // 🔄 RESET
  const handleReset = () => {
    loadResources();
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await deleteResource(id);
      loadResources();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-6">View Resources</h1>

      {/* ✅ USE SEARCH BAR COMPONENT */}
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {/* ERROR */}
      {error && <div className="text-red-500 mb-3">{error}</div>}

      {/* LOADING */}
      {loading && <div>Loading...</div>}

      {/* TABLE */}
      <table className="w-full bg-white shadow rounded mt-4">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-3">Code</th>
      <th className="p-3">Name</th>
      <th className="p-3">Type</th>
      <th className="p-3">Capacity</th>
      <th className="p-3">Location</th>
      <th className="p-3">Start Date</th>
      <th className="p-3">Start Time</th>
      <th className="p-3">End Date</th>
      <th className="p-3">End Time</th>
      <th className="p-3">Status</th>
      <th className="p-3">Description</th>
      <th className="p-3">Actions</th>
    </tr>
  </thead>

  <tbody>
    {resources.map((r) => (
      <tr key={r.id} className="border-t">
        <td className="p-3">{r.resourceCode}</td>
        <td className="p-3">{r.name}</td>
        <td className="p-3">{r.type}</td>
        <td className="p-3">{r.capacity}</td>
        <td className="p-3">{r.location}</td>

        <td className="p-3">{r.startDate}</td>
        <td className="p-3">{r.startTime}</td>
        <td className="p-3">{r.endDate}</td>
        <td className="p-3">{r.endTime}</td>

        <td className="p-3">{r.status}</td>
        <td className="p-3">{r.description}</td>

        <td className="p-3">
          <a href={`/edit/${r.id}`} className="text-blue-600 mr-2">
            Edit
          </a>

          <button
            onClick={() => handleDelete(r.id)}
            className="text-red-600"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {resources.length === 0 && !loading && (
        <div className="text-center p-5 text-gray-500">
          No results found
        </div>
      )}

    </div>
  );
}

export default ViewResources;