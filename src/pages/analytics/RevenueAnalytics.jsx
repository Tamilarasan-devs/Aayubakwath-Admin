import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getKPIs,
  getRevenueOverTime,
  getRevenueByCategory,
  getTopProducts,
} from "../../services/analyticsService";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#7c3aed",
  "#5b21b6",
  "#4c1d95",
];

export default function RevenueAnalytics() {
  const [range, setRange] = useState("30d");

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["analytics-kpis", range],
    queryFn: () => getKPIs(range),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics-revenue-over-time", range],
    queryFn: () => getRevenueOverTime(range),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["analytics-revenue-by-category"],
    queryFn: getRevenueByCategory,
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ["analytics-top-products"],
    queryFn: () => getTopProducts(10),
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Revenue Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Track revenue performance and trends
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<IndianRupee className="w-5 h-5 text-violet-600" />}
          label="Total Revenue"
          value={kpisLoading ? "..." : kpis?.revenue || 0}
          change={kpis?.revenueChange}
          prefix="Rs."
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          label="Avg Order Value"
          value={kpisLoading ? "..." : kpis?.aov || 0}
          change={kpis?.aovChange}
          prefix="Rs."
          bg="bg-emerald-50"
        />
        <KPIStatCard
          icon={<ArrowUpRight className="w-5 h-5 text-sky-600" />}
          label="Total Orders"
          value={kpisLoading ? "..." : kpis?.orders || 0}
          change={kpis?.ordersChange}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<ArrowDownRight className="w-5 h-5 text-red-500" />}
          label="Cancellation Rate"
          value={kpisLoading ? "..." : kpis?.cancellationRate || 0}
          suffix="%"
          bg="bg-red-50"
        />
      </div>

      <ChartCard
        title="Revenue Over Time"
        subtitle="Revenue trend with order count overlay"
        loading={revenueLoading}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData || []}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
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
                tickFormatter={(v) => `Rs.${v.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [
                  `Rs.${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue by Category"
          subtitle="Revenue distribution across product categories"
          loading={categoryLoading}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `Rs.${v.toLocaleString()}`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [
                    `Rs.${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {(categoryData || []).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top Products by Revenue"
          subtitle="Best performing products"
          loading={topProductsLoading}
        >
          <div className="space-y-3">
            {(topProducts || []).slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-300 w-6 text-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    Rs.{product.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {product.unitsSold} sold
                  </p>
                </div>
              </div>
            ))}
            {(!topProducts || topProducts.length === 0) &&
              !topProductsLoading && (
                <p className="text-center text-gray-400 text-sm py-8">
                  No product data yet
                </p>
              )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
