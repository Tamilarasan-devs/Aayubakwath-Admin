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
import {
  ShoppingCart,
  Heart,
  XCircle,
  DollarSign,
  Package,
} from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { ChartCard } from "../../components/ui/ChartCard";
import {
  getCartStats,
  getWishlistStats,
} from "../../services/analyticsService";

const BAR_COLORS = [
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

export default function CartWishlistAnalytics() {
  const { data: cartStats, isLoading: cartLoading } = useQuery({
    queryKey: ["analytics-cart-stats"],
    queryFn: getCartStats,
  });

  const { data: wishlistStats, isLoading: wishlistLoading } = useQuery({
    queryKey: ["analytics-wishlist-stats"],
    queryFn: getWishlistStats,
  });

  const cartBarData = (cartStats?.mostCarted || []).slice(0, 8).map((item) => ({
    name:
      item.product.length > 15
        ? item.product.slice(0, 15) + "..."
        : item.product,
    count: item.cartCount,
    quantity: item.totalQuantity,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Cart & Wishlist Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Shopping behavior and intent analysis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<ShoppingCart className="w-5 h-5 text-violet-600" />}
          label="Active Carts"
          value={cartLoading ? "..." : cartStats?.totalUniqueCarts || 0}
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<Package className="w-5 h-5 text-sky-600" />}
          label="Cart Items"
          value={cartLoading ? "..." : cartStats?.totalQuantity || 0}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<Heart className="w-5 h-5 text-rose-500" />}
          label="Wishlist Items"
          value={
            wishlistLoading ? "..." : wishlistStats?.totalWishlistItems || 0
          }
          bg="bg-rose-50"
        />
        <KPIStatCard
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          label="Abandonment Rate"
          value={cartLoading ? "..." : cartStats?.abandonmentRate || 0}
          suffix="%"
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Cart Value Summary"
          subtitle="Total value locked in active carts"
          loading={cartLoading}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 rounded-xl text-center">
              <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-semibold text-gray-900">
                Rs.{(cartStats?.totalValue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Total Cart Value
              </p>
            </div>
            <div className="p-5 bg-gray-50 rounded-xl text-center">
              <ShoppingCart className="w-6 h-6 text-violet-600 mx-auto mb-2" />
              <p className="text-2xl font-semibold text-gray-900">
                {cartStats?.totalCartItems || 0}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Cart Entries
              </p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Conversion Overview"
          subtitle="Cart to order conversion metrics"
          loading={cartLoading}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {cartStats?.totalOrders || 0}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Total Orders
              </p>
            </div>
            <div className="p-5 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-semibold text-gray-900">
                {cartStats?.totalUniqueCarts || 0}
              </p>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-1">
                Unique Carts
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-violet-50 rounded-xl text-center">
            <p className="text-sm text-violet-600 font-medium">
              {cartStats?.abandonmentRate > 0
                ? `${cartStats.abandonmentRate}% of carts did not convert to orders`
                : "No cart abandonment data available"}
            </p>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Most Carted Products"
        subtitle="Products most frequently added to carts"
        loading={cartLoading}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cartBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
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
                dataKey="count"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                name="Cart Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        title="Top Wishlisted Products"
        subtitle="Products most saved to wishlists with conversion data"
        loading={wishlistLoading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="pb-3 text-left">#</th>
                <th className="pb-3 text-left">Product</th>
                <th className="pb-3 text-right">Wishlist Count</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Purchased</th>
                <th className="pb-3 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {(wishlistStats?.topWishlisted || []).map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 text-gray-300 font-semibold">
                    {index + 1}
                  </td>
                  <td className="py-3 font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                      {item.wishlistCount}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    Rs.{item.price}
                  </td>
                  <td className="py-3 text-right text-gray-500">
                    {item.purchasedCount}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.conversionRate > 50
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!wishlistStats?.topWishlisted ||
            wishlistStats.topWishlisted.length === 0) &&
            !wishlistLoading && (
              <p className="text-center text-gray-400 text-sm py-8">
                No wishlist data yet
              </p>
            )}
        </div>
      </ChartCard>
    </div>
  );
}
