import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

export default function ResourceDashboard({ resources }) {
  const data = Array.isArray(resources) ? resources : [];
  const [selectedType, setSelectedType] = useState("ALL");

  const filteredData =
    selectedType === "ALL"
      ? data
      : data.filter((r) => r?.type === selectedType);

  const total = filteredData.length;
  const active = filteredData.filter((r) => r?.status === "ACTIVE").length;
  const inactive = total - active;

  const capacity = filteredData.reduce(
    (sum, r) => sum + Number(r?.capacity || 0),
    0
  );

  const types = ["ALL", ...new Set(data.map((r) => r?.type || "Unknown"))];

  const statusData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
  ];

  const barData =
    selectedType === "ALL"
      ? Object.values(
          data.reduce((acc, r) => {
            const t = r?.type || "Unknown";
            acc[t] = acc[t] || { name: t, count: 0 };
            acc[t].count++;
            return acc;
          }, {})
        )
      : filteredData.map((r) => ({
          name: r?.name || "N/A",
          count: Number(r?.capacity || 0),
        }));

  const lineData = filteredData.map((r) => ({
    name: r?.name || "N/A",
    capacity: Number(r?.capacity || 0),
  }));

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="fixed top-14 left-56 right-0 bottom-0 bg-slate-100 overflow-y-auto">

      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Resource Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Overview of all campus resources
            </p>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border px-4 py-2 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-400"
          >
            {types.map((type, i) => (
              <option key={i}>{type}</option>
            ))}
          </select>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Kpi title="Total" value={total} color="border-blue-500" />
          <Kpi title="Active" value={active} color="border-green-500" />
          <Kpi title="Inactive" value={inactive} color="border-red-500" />
          <Kpi title="Capacity" value={capacity} color="border-yellow-500" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* BAR */}
          <Card title={selectedType === "ALL"
            ? "Resource Types"
            : `${selectedType} Resources`}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* PIE */}
          <Card title={`Status (${selectedType})`}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" outerRadius={90}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* LINE */}
          <Card title={`Capacity (${selectedType})`}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

        </div>
      </div>
    </div>
  );
}

/* KPI */
function Kpi({ title, value, color }) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800 mt-1">
        {value}
      </h2>
    </div>
  );
}

/* CARD */
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-gray-700 font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}