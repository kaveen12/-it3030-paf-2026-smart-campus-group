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

  /* FILTERED DATA */
  const filteredData =
    selectedType === "ALL"
      ? data
      : data.filter((r) => r?.type === selectedType);

  /* KPI BASED ON FILTER */
  const total = filteredData.length;

  const active = filteredData.filter(
    (r) => r?.status === "ACTIVE"
  ).length;

  const inactive = total - active;

  const capacity = filteredData.reduce(
    (sum, r) => sum + Number(r?.capacity || 0),
    0
  );

  /* TYPES */
  const types = [
    "ALL",
    ...new Set(data.map((r) => r?.type || "Unknown")),
  ];

  /* PIE */
  const statusData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
  ];

  /* BAR */
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

  /* LINE */
  const lineData = filteredData.map((r) => ({
    name: r?.name || "N/A",
    capacity: Number(r?.capacity || 0),
  }));

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="fixed top-0 left-56 right-0 bottom-0 bg-slate-100 p-4 overflow-hidden">
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 flex flex-col gap-5 overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Resource Management Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Smart analytics overview
            </p>
          </div>

          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value)
            }
            className="border px-4 py-2 rounded-lg shadow text-sm"
          >
            {types.map((type, i) => (
              <option key={i}>{type}</option>
            ))}
          </select>
        </div>

        {/* KPI CARDS NOW CHANGE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
          <Kpi title="TOTAL" value={total} color="text-blue-400" />
          <Kpi title="ACTIVE" value={active} color="text-green-400" />
          <Kpi title="INACTIVE" value={inactive} color="text-red-400" />
          <Kpi title="CAPACITY" value={capacity} color="text-yellow-400" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">

          {/* BAR */}
          <Card title={selectedType === "ALL"
            ? "Resource Types"
            : `${selectedType} Resources`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* PIE */}
          <Card title={`Status (${selectedType})`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  outerRadius="70%"
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* LINE */}
          <Card title={`Capacity (${selectedType})`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value, color }) {
  return (
    <div className="bg-[#0f172a] rounded-xl p-5 shadow-lg text-white">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-4 flex flex-col shadow-xl min-h-0">
      <h2 className="text-gray-200 text-lg font-semibold mb-3">
        {title}
      </h2>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}