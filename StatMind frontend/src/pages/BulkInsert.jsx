import { useState } from "react";
import { uploadCSV } from "../api/resourceApi";

function BulkInsert() {

  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    try {
      await uploadCSV(file);
      alert("Uploaded!");
    } catch {
      alert("Failed!");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Bulk Insert</h1>

      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleUpload}
        className="ml-4 px-4 py-2 bg-green-600 text-white"
      >
        Upload CSV
      </button>
    </div>
  );
}

export default BulkInsert;