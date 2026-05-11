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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { axiosInstance } from "../utils/axiosInstance";
import { Card, CardBody } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { DateRangePicker } from "../components/ui/DateRangePicker";
import { KPIStatCard } from "../components/ui/KPIStatCard";
import {
  IndianRupee,
  Package,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  getKPIs,
  getRevenueOverTime,
  getOrderStatusDistribution,
  getRecentActivity,
} from "../services/analyticsService";
import { getBulkOrders, getContactInquiries } from "../services/inquiryService";

const STATUS_COLORS = {
  PROCESSING: "#6366f1",
  SHIPPED: "#f59e0b",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const statusVariant = {
  delivered: "success",
  processing: "info",
  cancelled: "error",
  shipped: "warning",
  pending: "warning",
};

async function getRecentOrders() {
  const { data } = await axiosInstance.get("/orders/admin/all");
  return (data.data || []).slice(0, 5).map((o) => ({
    id: `#${o.id.slice(0, 8).toUpperCase()}`,
    customer: o.user?.name || "Unknown",
    product: o.items?.[0]?.product?.productName || "N/A",
    amount: Number(o.totalAmount).toLocaleString("en-IN"),
    date: new Date(o.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase(),
  }));
}

export default function Dashboard() {
  const [range, setRange] = useState("30d");

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["analytics-kpis", range],
    queryFn: () => getKPIs(range),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["analytics-revenue-over-time", range],
    queryFn: () => getRevenueOverTime(range),
  });

  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ["analytics-order-status", range],
    queryFn: () => getOrderStatusDistribution(range),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["analytics-recent-activity"],
    queryFn: () => getRecentActivity(10),
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
  });

  const { data: bulkOrdersData, isLoading: bulkOrdersLoading } = useQuery({
    queryKey: ["dashboard-bulk-orders"],
    queryFn: () => getBulkOrders(1, 1),
  });

  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: ["dashboard-contact-inquiries"],
    queryFn: () => getContactInquiries(1, 1),
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pieData = (statusData || []).map((s) => ({
    name: s.status,
    value: s.count,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {kpisLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Card key={i} variant="elevated">
              <CardBody>
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4 animate-pulse" />
                <Skeleton variant="text" width="80px" className="mb-2" />
                <Skeleton variant="text" width="60px" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPIStatCard
            icon={<IndianRupee className="w-5 h-5 text-violet-600" />}
            label="Revenue"
            value={kpis?.revenue || 0}
            change={kpis?.revenueChange}
            prefix="Rs."
            bg="bg-violet-50"
          />
          <KPIStatCard
            icon={<Package className="w-5 h-5 text-sky-600" />}
            label="Products"
            value={kpis?.totalProducts || 0}
            bg="bg-sky-50"
          />
          <KPIStatCard
            icon={<Users className="w-5 h-5 text-amber-600" />}
            label="Users"
            value={kpis?.users || 0}
            change={kpis?.usersChange}
            bg="bg-amber-50"
          />
          <KPIStatCard
            icon={<ClipboardList className="w-5 h-5 text-emerald-600" />}
            label="Orders"
            value={kpis?.orders || 0}
            change={kpis?.ordersChange}
            bg="bg-emerald-50"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPIStatCard
          icon={<Truck className="w-5 h-5 text-rose-600" />}
          label="Bulk Orders"
          value={bulkOrdersData?.total || 0}
          bg="bg-rose-50"
          loading={bulkOrdersLoading}
        />
        <KPIStatCard
          icon={<MessageSquare className="w-5 h-5 text-teal-600" />}
          label="Contact Inquiries"
          value={contactData?.total || 0}
          bg="bg-teal-50"
          loading={contactLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card variant="elevated">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Revenue over selected period
              </p>
            </div>
            <CardBody>
              {revenueLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="h-64">
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
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          `Rs.${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                        }
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
              )}
            </CardBody>
          </Card>
        </div>

        <Card variant="elevated">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Order Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">Current distribution</p>
          </div>
          <CardBody>
            {statusLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {(statusData || []).map((s) => (
                <div key={s.status} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.status] }}
                  />
                  <span className="text-xs text-gray-500">{s.status}</span>
                  <span className="text-xs font-semibold text-gray-900 ml-auto">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="elevated">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest 5 transactions
            </p>
          </div>
          {ordersLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" width="100%" />
              ))}
            </div>
          ) : recentOrders?.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left">Order</th>
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left hidden md:table-cell">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left hidden lg:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders?.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-400 font-medium">
                        {o.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={o.customer} size="sm" />
                          <span className="font-medium text-gray-700">
                            {o.customer}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                        {o.product}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Rs.{o.amount}
                      </td>
                      <td className="px-6 py-4 text-gray-400 hidden lg:table-cell text-xs">
                        {o.date}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            statusVariant[o.status.toLowerCase()] || "default"
                          }
                        >
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card variant="elevated">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest system events</p>
          </div>
          {activityLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="text" width="100%" />
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {(recentActivity || []).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      activity.type === "order"
                        ? "bg-violet-500"
                        : activity.type === "user"
                          ? "bg-emerald-500"
                          : "bg-sky-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(activity.timestamp).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  {activity.status && (
                    <Badge
                      variant={
                        statusVariant[activity.status.toLowerCase()] ||
                        "default"
                      }
                    >
                      {activity.status}
                    </Badge>
                  )}
                </div>
              ))}
              {(!recentActivity || recentActivity.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-8">
                  No activity yet
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardBody className="text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-xl font-semibold text-gray-900">
              {kpis?.statusBreakdown?.processing || 0}
            </p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
              Processing
            </p>
          </CardBody>
        </Card>
        <Card variant="elevated">
          <CardBody className="text-center">
            <Truck className="w-6 h-6 text-sky-600 mx-auto mb-2" />
            <p className="text-xl font-semibold text-gray-900">
              {kpis?.statusBreakdown?.shipped || 0}
            </p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
              Shipped
            </p>
          </CardBody>
        </Card>
        <Card variant="elevated">
          <CardBody className="text-center">
            <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-xl font-semibold text-gray-900">
              {kpis?.statusBreakdown?.delivered || 0}
            </p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
              Delivered
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
