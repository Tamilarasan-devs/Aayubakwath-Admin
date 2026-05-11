import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Tags, DollarSign, Package, ShoppingCart } from "lucide-react";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getCategoryPerformance,
  getRevenueByCategory,
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

export default function CategoryAnalytics() {
  const { data: categoryPerformance, isLoading: perfLoading } = useQuery({
    queryKey: ["analytics-category-performance"],
    queryFn: getCategoryPerformance,
  });

  const { data: revenueByCategory, isLoading: revLoading } = useQuery({
    queryKey: ["analytics-revenue-by-category"],
    queryFn: getRevenueByCategory,
  });

  const totalRevenue = (revenueByCategory || []).reduce(
    (sum, c) => sum + c.revenue,
    0,
  );
  const totalProducts = (categoryPerformance || []).reduce(
    (sum, c) => sum + c.productCount,
    0,
  );
  const totalOrders = (categoryPerformance || []).reduce(
    (sum, c) => sum + c.orders,
    0,
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Category Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Category performance and revenue distribution
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Tags className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {categoryPerformance?.length || 0}
          </p>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
            Categories
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            Rs.{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
            Total Revenue
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {totalProducts}
          </p>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
            Total Products
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
            Total Orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue by Category"
          subtitle="Revenue contribution per category"
          loading={revLoading}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  height={60}
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
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {(revenueByCategory || []).map((_, index) => (
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
          title="Units Sold by Category"
          subtitle="Total units sold per category"
          loading={perfLoading}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  height={60}
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
                  dataKey="unitsSold"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Units Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Category Performance Dashboard"
        subtitle={`Detailed metrics for all ${categoryPerformance?.length || 0} categories`}
        loading={perfLoading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="pb-3 text-left">Category</th>
                <th className="pb-3 text-right">Products</th>
                <th className="pb-3 text-right">Revenue</th>
                <th className="pb-3 text-right">Orders</th>
                <th className="pb-3 text-right">Units Sold</th>
                <th className="pb-3 text-right">Avg Price</th>
                <th className="pb-3 text-left">Top Product</th>
              </tr>
            </thead>
            <tbody>
              {(categoryPerformance || []).map((cat) => (
                <tr
                  key={cat.category}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 font-medium text-gray-900">
                    {cat.category}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {cat.productCount}
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    Rs.{cat.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {cat.orders}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {cat.unitsSold}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    Rs.{cat.avgPrice}
                  </td>
                  <td className="py-3 text-gray-500">{cat.topProduct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!categoryPerformance || categoryPerformance.length === 0) &&
            !perfLoading && (
              <p className="text-center text-gray-400 text-sm py-8">
                No category data yet
              </p>
            )}
        </div>
      </ChartCard>
    </div>
  );
}
