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

  // 🔍 SEARCH
  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchResources(filters);
      setResources(data);
    } catch (err) {
      console.error(err);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
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

  // 🖨️ PRINT REPORT
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '24px', paddingTop: '0' }}>

      {/* ❌ this button will NOT print */}
      <div className="no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Download Report
        </button>
      </div>

      <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '24px' }}>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Resource Report
        </h1>

        {/* ❌ hide in print */}
        <div className="mb-6 no-print">
          <SearchBar onSearch={handleSearch} onReset={loadResources} />
        </div>

        {loading && (
          <p className="text-center text-blue-600 font-semibold mb-4">
            Loading...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 font-semibold mb-4">
            {error}
          </p>
        )}

        {/* 📊 REPORT AREA */}
        <div className="report-area w-full overflow-x-auto">

          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Capacity</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Start Date</th>
                <th className="p-3 border">Start Time</th>
                <th className="p-3 border">End Date</th>
                <th className="p-3 border">End Time</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border no-print">Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.length === 0 && !loading ? (
                <tr>
                  <td colSpan="12" className="p-4 text-center text-gray-500">
                    No resources found.
                  </td>
                </tr>
              ) : (
                resources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{r.resourceCode}</td>
                    <td className="p-3 border">{r.name}</td>
                    <td className="p-3 border">{r.type}</td>
                    <td className="p-3 border">{r.capacity}</td>
                    <td className="p-3 border">{r.location}</td>
                    <td className="p-3 border">{r.startDate}</td>
                    <td className="p-3 border">{r.startTime}</td>
                    <td className="p-3 border">{r.endDate}</td>
                    <td className="p-3 border">{r.endTime}</td>

                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        r.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3 border max-w-[180px] truncate">
                      {r.description}
                    </td>

                    {/* ❌ hidden in print */}
                    <td className="p-3 border no-print whitespace-nowrap">
                      <button onClick={() => handleDelete(r.id)} className="text-red-600">
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default ViewResources;