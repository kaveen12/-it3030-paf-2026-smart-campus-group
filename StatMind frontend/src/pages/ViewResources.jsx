// ViewResources.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllResources,
  searchResources,
  deleteResource,
} from "../api/resourceApi";
import SearchBar from "../components/SearchBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";


function ViewResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllResources();
      setResources(data);
    } catch {
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);

    try {
      const data = await searchResources(filters);
      setResources(data);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await deleteResource(id);
      loadResources();
    } catch {
      alert("Delete failed");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

 const handleDownloadPDF = () => {
  const doc = new jsPDF("l", "mm", "a4");

  const date = new Date().toLocaleString();

  // 🔥 Title
  doc.setFontSize(18);
  doc.text("Resource Report", 14, 15);

  // 🔥 Date
  doc.setFontSize(11);
  doc.text(`Generated Date: ${date}`, 14, 22);

  // 🔥 Table data (NO action column)
  const table = document.querySelector("table");

  autoTable(doc, {
    html: table,
    startY: 30,

    // ❌ remove action column (last column)
    didParseCell: function (data) {
      const header = data.column.dataKey;

      // if your action column is last one
      if (data.column.index === table.rows[0].cells.length - 1) {
        data.cell.text = "";
      }
    },

    styles: {
      fontSize: 9,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [41, 128, 185], // nice blue
    },
  });

  doc.save("Resource_Report.pdf");
};
  return (
    <div className="fixed top-16 left-64 right-0 bottom-0 bg-slate-100 p-4 overflow-hidden">
      <div className="h-full w-full bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">

        {/* PAGE TITLE */}
        <div className="px-6 pt-5 pb-3 border-b bg-white shrink-0">
          <h1 className="text-3xl font-bold text-gray-800">
            Resource View
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View, manage, search and export all resources
          </p>
        </div>

        {/* TOP ACTION BAR */}
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-semibold text-gray-700">
            Resource Report
          </h2>

          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b bg-white shrink-0">
          <SearchBar onSearch={handleSearch} onReset={loadResources} />
        </div>

        {loading && (
          <div className="text-center py-3 text-blue-600 font-semibold">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center py-3 text-red-600 font-semibold">
            {error}
          </div>
        )}

        {/* Table */}
        <div
          ref={reportRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
        >
          <table className="w-full table-fixed text-sm">
            <thead className="sticky top-0 bg-blue-700 text-white z-10">
              <tr>
                <th className="p-3 w-[90px]">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3 w-[90px]">Capacity</th>
                <th className="p-3">Location</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3 w-[100px]">Status</th>
                <th className="p-3">Description</th>
                <th className="p-3 w-[160px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.length === 0 && !loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-10 text-gray-500">
                    No resources found
                  </td>
                </tr>
              ) : (
                resources.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`border-b hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="p-3">{r.resourceCode}</td>
                    <td className="p-3">{r.name}</td>

                    <td className="p-3 whitespace-normal break-words">
                      {r.type}
                    </td>

                    <td className="p-3 text-center">{r.capacity}</td>

                    <td className="p-3">{r.location}</td>

                    <td className="p-3">
                      {r.startDate}
                      <br />
                      {r.startTime}
                    </td>

                    <td className="p-3">
                      {r.endDate}
                      <br />
                      {r.endTime}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          r.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3 whitespace-normal break-words">
                      {r.description}
                    </td>
<td className="p-3 no-print">
  <div className="flex gap-2 justify-center">
    <button
      onClick={() => handleEdit(r.id)}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(r.id)}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
    >
      Delete
    </button>
  </div>
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