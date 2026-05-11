import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Users, UserPlus, Repeat, TrendingUp } from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getKPIs,
  getUserGrowth,
  getUserRoleDistribution,
  getUserOrderFrequency,
} from "../../services/analyticsService";

const ROLE_COLORS = { USER: "#6366f1", ADMIN: "#f59e0b", MODERATOR: "#10b981" };
const FREQ_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8"];

export default function UserAnalytics() {
  const [range, setRange] = useState("30d");

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["analytics-kpis", range],
    queryFn: () => getKPIs(range),
  });

  const { data: userGrowth, isLoading: growthLoading } = useQuery({
    queryKey: ["analytics-user-growth", range],
    queryFn: () => getUserGrowth(range),
  });

  const { data: roleDistribution, isLoading: roleLoading } = useQuery({
    queryKey: ["analytics-user-roles"],
    queryFn: getUserRoleDistribution,
  });

  const { data: orderFrequency, isLoading: freqLoading } = useQuery({
    queryKey: ["analytics-user-frequency"],
    queryFn: getUserOrderFrequency,
  });

  const rolePieData = (roleDistribution || []).map((r) => ({
    name: r.role,
    value: r.count,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            User Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            User acquisition, growth, and engagement
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<Users className="w-5 h-5 text-violet-600" />}
          label="New Users"
          value={kpisLoading ? "..." : kpis?.users || 0}
          change={kpis?.usersChange}
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<UserPlus className="w-5 h-5 text-emerald-600" />}
          label="Total Revenue"
          value={kpisLoading ? "..." : kpis?.revenue || 0}
          change={kpis?.revenueChange}
          prefix="Rs."
          bg="bg-emerald-50"
        />
        <KPIStatCard
          icon={<Repeat className="w-5 h-5 text-sky-600" />}
          label="Total Orders"
          value={kpisLoading ? "..." : kpis?.orders || 0}
          change={kpis?.ordersChange}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
          label="Avg Order Value"
          value={kpisLoading ? "..." : kpis?.aov || 0}
          change={kpis?.aovChange}
          prefix="Rs."
          bg="bg-amber-50"
        />
      </div>

      <ChartCard
        title="User Growth Over Time"
        subtitle="New user registrations and cumulative growth"
        loading={growthLoading}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth || []}>
              <defs>
                <linearGradient
                  id="cumulativeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="New Users"
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#cumulativeGradient)"
                name="Cumulative"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="User Role Distribution"
          subtitle="Breakdown of users by role"
          loading={roleLoading}
        >
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rolePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {rolePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={ROLE_COLORS[entry.name] || "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="User Order Frequency"
          subtitle="Distribution of users by number of orders placed"
          loading={freqLoading}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderFrequency || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Orders",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 12,
                    fill: "#9ca3af",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Users",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                    fill: "#9ca3af",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {(orderFrequency || []).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={FREQ_COLORS[index % FREQ_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Role Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(roleDistribution || []).map((r) => (
            <div key={r.role} className="p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ROLE_COLORS[r.role] }}
                />
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {r.role}
                </span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{r.count}</p>
              <p className="text-xs text-gray-400">{r.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
