import { useEffect, useState } from "react";
import { getAllResources, searchResources } from "../api/resourceApi";
import UserNavbar from "../components/usernav";

function UserViewResource() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const data = await getAllResources();
    setResources(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    const data = await searchResources(filters);
    setResources(data);
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({ type: "", location: "", capacity: "" });
    loadResources();
  };

  // ✅ STATS (FIXED)
  const activeResources = resources.filter(
    (r) => r.status === "ACTIVE"
  ).length;

  const totalCapacity = resources.reduce(
    (sum, r) => sum + (r.capacity || 0),
    0
  );

  const matchingResults = resources.length; // because search already filters data

  return (
    <>
      <UserNavbar />

      <div className="ml-56 mt-14 bg-slate-100 min-h-screen p-6">

        {/* HERO */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow mb-6">
          <h1 className="text-3xl font-bold">
            Browse active rooms and equipment
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            Explore available campus resources, filter by type, location, and capacity.
          </p>
        </div>

        {/* STATS CARDS (FIXED) */}
       

        {/* FILTER */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">

          <h2 className="font-semibold text-gray-700 mb-3">
            Find the right resource
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <input
              type="text"
              placeholder="Type (LAB, HALL...)"
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <input
              type="number"
              placeholder="Min Capacity"
              value={filters.capacity}
              onChange={(e) =>
                setFilters({ ...filters, capacity: e.target.value })
              }
              className="border p-2 rounded-lg"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
              >
                Search
              </button>

              <button
                onClick={handleReset}
                className="bg-gray-200 px-4 py-2 rounded-lg w-full"
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <p className="text-center text-blue-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {resources.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border"
              >

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {r.type}
                  </span>

                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {r.status}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-800">
                  {r.name}
                </h2>

                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📍 {r.location}</p>
                  <p>👥 Capacity: {r.capacity}</p>
                  <p>Status:{r.status}</p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </>
  );
}

export default UserViewResource;