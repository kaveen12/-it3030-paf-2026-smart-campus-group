function SearchBar({ keyword, setKeyword, handleSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex gap-3 mb-5">
      <input
        type="text"
        placeholder="Search by name, code, type..."
        className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSearch}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;