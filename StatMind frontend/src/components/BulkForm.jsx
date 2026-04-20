import { useState } from "react";
import { bulkInsert } from "../api/resourceApi";

function BulkForm() {

  const emptyRow = {
    resourceCode: "",
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
  };

  const [rows, setRows] = useState([emptyRow]);

  // change handler
  const handleChange = (index, e) => {
    const newRows = [...rows];
    newRows[index][e.target.name] = e.target.value;
    setRows(newRows);
  };

  // add row
  const addRow = () => {
    setRows([...rows, emptyRow]);
  };

  // remove row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // submit bulk
  const handleSubmit = async () => {
    try {
      await bulkInsert(rows);
      alert("Bulk Insert Success");
      setRows([emptyRow]);
    } catch (err) {
      console.error(err);
      alert("Bulk Insert Failed");
    }
  };

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">
        Bulk Insert Resources
      </h2>

      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-3 p-3 border rounded">

          <input
            name="resourceCode"
            placeholder="Resource Code"
            value={row.resourceCode}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="name"
            placeholder="Name"
            value={row.name}
            onChange={(e) => handleChange(index, e)}
          />

          <select
            name="type"
            value={row.type}
            onChange={(e) => handleChange(index, e)}
          >
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="AUDITORIUM">Auditorium</option>
            <option value="CLASSROOM">Classroom</option>
          </select>

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={row.capacity}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            name="location"
            placeholder="Location"
            value={row.location}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="date"
            name="startDate"
            value={row.startDate}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="time"
            name="startTime"
            value={row.startTime}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="date"
            name="endDate"
            value={row.endDate}
            onChange={(e) => handleChange(index, e)}
          />

          <input
            type="time"
            name="endTime"
            value={row.endTime}
            onChange={(e) => handleChange(index, e)}
          />

          <select
            name="status"
            value={row.status}
            onChange={(e) => handleChange(index, e)}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <input
            name="description"
            placeholder="Description"
            value={row.description}
            onChange={(e) => handleChange(index, e)}
          />

          <button
            onClick={() => removeRow(index)}
            className="bg-red-500 text-white px-2"
          >
            X
          </button>

        </div>
      ))}

      <div className="flex gap-3 mt-4">

        <button
          onClick={addRow}
          className="bg-gray-600 text-white px-4 py-2"
        >
          + Add Row
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2"
        >
          Submit Bulk
        </button>

      </div>

    </div>
  );
}

export default BulkForm;