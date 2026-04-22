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
} from "recharts";

export default function ResourceDashboard({ resources = [] }) {
  const data = Array.isArray(resources) ? resources : [];

  const total = data.length;

  const active = data.filter((r) => r?.status === "ACTIVE").length;
  const inactive = total - active;

  const capacity = data.reduce(
    (sum, r) => sum + (Number(r?.capacity) || 0),
    0
  );

  const statusData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
  ];

  const typeData = Object.values(
    data.reduce((acc, r) => {
      const type = r?.type || "Unknown";
      if (!acc[type]) acc[type] = { type, count: 0 };
      acc[type].count += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#22c55e", "#ef4444"]; // green, red

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Supply Resource Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi title="TOTAL" value={total} />
        <Kpi title="ACTIVE" value={active} />
        <Kpi title="INACTIVE" value={inactive} />
        <Kpi title="CAPACITY" value={capacity} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-[#1e293b] p-5 rounded-xl shadow-md">
          <h2 className="mb-4 text-gray-300 font-semibold">
            Type Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <XAxis dataKey="type" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-[#1e293b] p-5 rounded-xl shadow-md">
          <h2 className="mb-4 text-gray-300 font-semibold">
            Status Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* KPI CARD */
function Kpi({ title, value }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 shadow-sm">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}