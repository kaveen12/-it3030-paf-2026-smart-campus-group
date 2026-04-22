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

export default function ResourceDashboard({ resources }) {
  const data = Array.isArray(resources) ? resources : [];

  const total = data.length;
  const active = data.filter((r) => r?.status === "ACTIVE").length;
  const inactive = total - active;

  const capacity = data.reduce((sum, r) => sum + Number(r?.capacity || 0), 0);

  const statusData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
  ];

  const typeData = Object.values(
    data.reduce((acc, r) => {
      const t = r?.type || "Unknown";
      acc[t] = acc[t] || { type: t, count: 0 };
      acc[t].count++;
      return acc;
    }, {})
  );

  const COLORS = ["#f59e0b", "#ef4444"];

  return (
   <div className="ml-64 pt-16 w-[calc(100%-16rem)] min-h-screen bg-[#0f172a] text-white p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Supply Resource Dashboard
      </h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Kpi title="TOTAL" value={total} />
        <Kpi title="ACTIVE" value={active} />
        <Kpi title="INACTIVE" value={inactive} />
        <Kpi title="CAPACITY" value={capacity} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR */}
        <div className="bg-[#1e293b] p-5 rounded-xl">
          <h2 className="mb-3 text-gray-300">Type Distribution</h2>

          <ResponsiveContainer width="99%" height={300}>
            <BarChart data={typeData}>
              <XAxis dataKey="type" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-[#1e293b] p-5 rounded-xl">
          <h2 className="mb-3 text-gray-300">Status Overview</h2>

          <ResponsiveContainer width="99%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={100} label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
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

function Kpi({ title, value }) {
  return (
    <div className="bg-[#1e293b] p-4 rounded-lg shadow border border-gray-700">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}