import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllResources,
  searchResources,
  deleteResource,
} from "../api/resourceApi";
import SearchBar from "../components/SearchBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ResourcesNavbar from "../components/ResourceNavbar";

function ViewResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const tableRef = useRef();

  // LOAD ALL
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllResources();
      setResources(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  // SEARCH
 const handleSearch = async (filters) => {
  setLoading(true);
  setError(null);

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "")
  );

  // ✅ FIX lecture hall → LECTURE_HALL
  if (cleanFilters.type) {
  cleanFilters.type = cleanFilters.type.trim();
}

if (cleanFilters.capacity) {
  cleanFilters.capacity = Number(cleanFilters.capacity);
}

  try {
    const data = await searchResources(cleanFilters);
    setResources(data || []);
  } catch (err) {
    console.error(err);
    setError("Search failed");
  } finally {
    setLoading(false);
  }
};

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?"))
      return;

    try {
      await deleteResource(id);
      loadResources();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // EDIT
  const handleEdit = (id) => {
    navigate(`/editResource/${id}`);
  };

  // PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Resource Management Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, 14, 22);

    autoTable(doc, {
      html: tableRef.current,
      startY: 28,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235] },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === data.table.columns.length - 1
        ) {
          data.cell.text = "";
        }
      },
    });

    doc.save("Resource_Report.pdf");
  };

  return (
    <>
      {/* NAVBAR */}
      <ResourcesNavbar />

      {/* MAIN */}
      <div className="ml-56 mt-14 bg-slate-100 min-h-screen">
        <div className="p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Resource Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage, search and export resources
              </p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Download PDF
            </button>
          </div>

          {/* SEARCH */}
          <div className="p-4 bg-white border-b">
            <SearchBar
              onSearch={handleSearch}
              onReset={loadResources}
            />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-3 text-blue-600 font-semibold">
              Loading...
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center py-3 text-red-600 font-semibold">
              {error}
            </div>
          )}

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">

              <table ref={tableRef} className="w-full text-sm">
                <thead className="bg-slate-100 text-gray-700">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Start</th>
                    <th className="p-3">End</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Actions</th>
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
                        className={`border-t ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } hover:bg-blue-50 transition`}
                      >
                        <td className="p-3">{r.resourceCode}</td>
                        <td className="p-3">{r.name}</td>
                        <td className="p-3">{r.type}</td>
                        <td className="p-3 text-center">{r.capacity}</td>
                        <td className="p-3">{r.location}</td>

                        <td className="p-3 text-xs">
                          {r.startDate}<br />{r.startTime}
                        </td>

                        <td className="p-3 text-xs">
                          {r.endDate}<br />{r.endTime}
                        </td>

                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              r.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="p-3 max-w-[200px] truncate">
                          {r.description}
                        </td>

                        <td className="p-3">
                          <div className="flex justify-center gap-2">
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
      </div>
    </>
  );
}

export default ViewResources;