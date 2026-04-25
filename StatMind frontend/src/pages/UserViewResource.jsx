import { useEffect, useState } from "react";
import { getAllResources, searchResources } from "../api/resourceApi";
import UserNavbar from "../components/UserNavbar";

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

  return (
    <>
      <UserNavbar />

      <div className="fixed top-14 left-56 right-0 bottom-0 bg-slate-100 p-6 overflow-auto">

        <div className="bg-white rounded-2xl shadow p-6 min-h-full">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Facility Catalogue
            </h1>
            <p className="text-gray-500">
              Browse available lecture halls, labs, rooms & equipment
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">

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

          {/* CONTENT */}
          {loading ? (
            <p className="text-center text-blue-600">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {resources.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-50 rounded-xl shadow hover:shadow-lg transition p-5 border"
                >

                  {/* TITLE */}
                  <h2 className="text-lg font-bold text-gray-800">
                    {r.name}
                  </h2>

                  {/* TYPE BADGE */}
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {r.type}
                  </span>

                  {/* DETAILS */}
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>📍 {r.location}</p>
                    <p>👥 Capacity: {r.capacity}</p>
                    <p>📌 Status: {r.status}</p>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default UserViewResource;