import { useState } from "react";

function SearchBar({ onSearch, onReset }) {
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    capacity: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchClick = () => {
    onSearch({
      type: filters.type || null,
      location: filters.location || null,
      capacity: filters.capacity ? Number(filters.capacity) : null
    });
  };

  const handleReset = () => {
    const reset = { type: "", location: "", capacity: "" };
    setFilters(reset);
    onReset();
  };

  return (
    <div className="flex gap-3 mb-6">

      <input
        name="type"
        placeholder="Type"
        value={filters.type}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="capacity"
        type="number"
        placeholder="Capacity"
        value={filters.capacity}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <button
        onClick={handleSearchClick}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <button
        onClick={handleReset}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Reset
      </button>

    </div>
  );
}

export default SearchBar;