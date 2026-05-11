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
  Cell,
} from "recharts";
import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getKPIs,
  getTopProducts,
  getRevenueByCategory,
  getLowPerformingProducts,
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
  "#6d28d9",
  "#5b21b6",
];

export default function ProductAnalytics() {
  const [topLimit, setTopLimit] = useState(10);

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["analytics-kpis", "30d"],
    queryFn: () => getKPIs("30d"),
  });

  const { data: topProducts, isLoading: topLoading } = useQuery({
    queryKey: ["analytics-top-products", topLimit],
    queryFn: () => getTopProducts(topLimit),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["analytics-revenue-by-category"],
    queryFn: getRevenueByCategory,
  });

  const { data: lowPerforming, isLoading: lowLoading } = useQuery({
    queryKey: ["analytics-low-performing"],
    queryFn: () => getLowPerformingProducts(30),
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Product Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Product performance and category insights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<Package className="w-5 h-5 text-violet-600" />}
          label="Active Products"
          value={kpisLoading ? "..." : kpis?.totalProducts || 0}
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          label="Avg Order Value"
          value={kpisLoading ? "..." : kpis?.aov || 0}
          change={kpis?.aovChange}
          prefix="Rs."
          bg="bg-emerald-50"
        />
        <KPIStatCard
          icon={<TrendingUp className="w-5 h-5 text-sky-600" />}
          label="Total Orders"
          value={kpisLoading ? "..." : kpis?.orders || 0}
          change={kpis?.ordersChange}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          label="Low Performers"
          value={lowLoading ? "..." : lowPerforming?.length || 0}
          changeLabel="No orders in 30 days"
          bg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue by Category"
          subtitle="Revenue distribution across categories"
          loading={categoryLoading}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData || []}>
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
          title="Category Performance Summary"
          subtitle="Products, revenue, and units per category"
          loading={categoryLoading}
        >
          <div className="space-y-3">
            {(categoryData || []).map((cat) => (
              <div
                key={cat.category}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {cat.category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {cat.productCount} products
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    Rs.{cat.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {cat.unitsSold} units ({cat.percentage}%)
                  </p>
                </div>
              </div>
            ))}
            {(!categoryData || categoryData.length === 0) &&
              !categoryLoading && (
                <p className="text-center text-gray-400 text-sm py-8">
                  No category data yet
                </p>
              )}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title={`Top ${topLimit} Products by Revenue`}
        subtitle="Best selling products ranked by revenue"
        loading={topLoading}
      >
        <div className="flex items-center gap-2 mb-4">
          {[5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => setTopLimit(n)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                topLimit === n
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Top {n}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="pb-3 text-left">#</th>
                <th className="pb-3 text-left">Product</th>
                <th className="pb-3 text-left">Category</th>
                <th className="pb-3 text-right">Revenue</th>
                <th className="pb-3 text-right">Units Sold</th>
                <th className="pb-3 text-right">Avg Price</th>
              </tr>
            </thead>
            <tbody>
              {(topProducts || []).map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 text-gray-300 font-semibold">
                    {index + 1}
                  </td>
                  <td className="py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">
                    Rs.{product.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {product.unitsSold}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    Rs.{product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!topProducts || topProducts.length === 0) && !topLoading && (
            <p className="text-center text-gray-400 text-sm py-8">
              No product data yet
            </p>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Low Performing Products"
        subtitle={`Products with no orders in the last 30 days (${lowPerforming?.length || 0} products)`}
        loading={lowLoading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="pb-3 text-left">Product</th>
                <th className="pb-3 text-left">Category</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Days Since Creation</th>
              </tr>
            </thead>
            <tbody>
              {(lowPerforming || []).slice(0, 15).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-3 text-gray-500">{product.category}</td>
                  <td className="py-3 text-right text-gray-500">
                    Rs.{product.price}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                      {product.daysSinceCreation} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!lowPerforming || lowPerforming.length === 0) && !lowLoading && (
            <p className="text-center text-gray-400 text-sm py-8">
              All products have recent orders
            </p>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
