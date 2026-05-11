import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getKPIs,
  getOrdersOverTime,
  getOrderStatusDistribution,
  getFulfillmentMetrics,
} from "../../services/analyticsService";

const STATUS_COLORS = {
  PROCESSING: "#6366f1",
  SHIPPED: "#f59e0b",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

export default function OrderAnalytics() {
  const [range, setRange] = useState("30d");

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["analytics-kpis", range],
    queryFn: () => getKPIs(range),
  });

  const { data: ordersOverTime, isLoading: ordersTimeLoading } = useQuery({
    queryKey: ["analytics-orders-over-time", range],
    queryFn: () => getOrdersOverTime(range),
  });

  const { data: statusDistribution, isLoading: statusLoading } = useQuery({
    queryKey: ["analytics-order-status", range],
    queryFn: () => getOrderStatusDistribution(range),
  });

  const { data: fulfillment, isLoading: fulfillmentLoading } = useQuery({
    queryKey: ["analytics-fulfillment"],
    queryFn: getFulfillmentMetrics,
  });

  const pieData = (statusDistribution || []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Order Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Order performance and fulfillment metrics
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<ClipboardList className="w-5 h-5 text-violet-600" />}
          label="Total Orders"
          value={kpisLoading ? "..." : kpis?.orders || 0}
          change={kpis?.ordersChange}
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Processing"
          value={kpisLoading ? "..." : kpis?.statusBreakdown?.processing || 0}
          bg="bg-amber-50"
        />
        <KPIStatCard
          icon={<Truck className="w-5 h-5 text-sky-600" />}
          label="Shipped"
          value={kpisLoading ? "..." : kpis?.statusBreakdown?.shipped || 0}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          label="Delivered"
          value={kpisLoading ? "..." : kpis?.statusBreakdown?.delivered || 0}
          bg="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Orders Over Time"
          subtitle="Daily order volume with delivery and cancellation breakdown"
          loading={ordersTimeLoading}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersOverTime || []}>
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
                <Bar
                  dataKey="orders"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Total"
                />
                <Bar
                  dataKey="delivered"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Delivered"
                />
                <Bar
                  dataKey="cancelled"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Cancelled"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Order Status Distribution"
          subtitle="Breakdown of orders by current status"
          loading={statusLoading}
        >
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || "#9ca3af"}
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
      </div>

      <ChartCard
        title="Fulfillment Metrics"
        subtitle="Order processing and delivery time analysis"
        loading={fulfillmentLoading}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-3xl font-semibold text-gray-900">
              {fulfillmentLoading ? "..." : `${fulfillment?.avgDays || 0}d`}
            </p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-2">
              Average Delivery Time
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-3xl font-semibold text-gray-900">
              {fulfillmentLoading ? "..." : `${fulfillment?.medianDays || 0}d`}
            </p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-2">
              Median Delivery Time
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-3xl font-semibold text-gray-900">
              {fulfillmentLoading ? "..." : `${fulfillment?.p95Days || 0}d`}
            </p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-2">
              95th Percentile
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Total delivered orders:{" "}
            <span className="font-semibold text-gray-700">
              {fulfillment?.totalDelivered || 0}
            </span>
          </p>
        </div>
      </ChartCard>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">
          Status Revenue Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(statusDistribution || []).map((s) => (
            <div
              key={s.status}
              className="p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[s.status] }}
                />
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  {s.status}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{s.count}</p>
              <p className="text-xs text-gray-400">
                Rs.{s.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
