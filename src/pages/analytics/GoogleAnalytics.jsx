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
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Globe,
  ExternalLink,
  Search,
} from "lucide-react";
import { KPIStatCard } from "../../components/ui/KPIStatCard";
import { DateRangePicker } from "../../components/ui/DateRangePicker";
import { ChartCard } from "../../components/ui/ChartCard";
import { Card, CardBody } from "../../components/ui/Card";
import { getGaOverview } from "../../services/gaAnalyticsService";

const COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd",
  "#818cf8", "#7c3aed", "#f59e0b", "#10b981",
  "#ef4444", "#3b82f6", "#14b8a6", "#f97316",
];

function formatDuration(seconds) {
  if (!seconds) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatPercent(value) {
  if (value == null) return "0%";
  return `${(value * 100).toFixed(1)}%`;
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

export default function GoogleAnalytics() {
  const [range, setRange] = useState("30d");

  const rangeDays = range === "7d" ? 7 : range === "90d" ? 90 : range === "1y" ? 365 : 30;

  const { data, isLoading } = useQuery({
    queryKey: ["ga-analytics-overview", rangeDays],
    queryFn: () => getGaOverview(rangeDays),
  });

  const configured = data?.configured;
  const overview = data?.overview;
  const trafficSources = data?.trafficSources || [];
  const topPages = data?.topPages || [];
  const topProducts = data?.topProducts || [];
  const trend = data?.trend || [];

  if (!isLoading && configured === false) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Google Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Website traffic and visitor insights
            </p>
          </div>
          <DateRangePicker value={range} onChange={setRange} />
        </div>
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Globe className="w-16 h-16 text-gray-300 mb-6" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Google Analytics Not Configured
              </h2>
              <p className="text-gray-400 text-sm max-w-md mb-6">
                To see Google Analytics data in your admin panel, you need to set up
                a Google Cloud service account and add your GA4 property credentials.
              </p>
              <div className="text-left text-sm text-gray-500 space-y-3 max-w-lg">
                <p className="font-medium text-gray-700 mb-2">Setup Steps:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Go to the{" "}
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                    >
                      Google Cloud Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the Google Analytics Data API</li>
                  <li>
                    Create a service account and download the JSON key file
                  </li>
                  <li>
                    Add the service account email to your GA4 property as a viewer
                  </li>
                  <li>
                    Set these environment variables on your backend server:
                  </li>
                </ol>
                <div className="bg-gray-50 rounded-lg p-4 mt-3 font-mono text-xs">
                  <p>GA_PROPERTY_ID=your-ga4-property-id</p>
                    <p>{'GOOGLE_APPLICATION_CREDENTIALS_JSON=\'{ ... your service account JSON ... }\''}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Google Analytics
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Website traffic and visitor insights from GA4
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPIStatCard
          icon={<Users className="w-5 h-5 text-violet-600" />}
          label="Active Users"
          value={isLoading ? "..." : overview?.activeUsers || 0}
          bg="bg-violet-50"
        />
        <KPIStatCard
          icon={<MousePointerClick className="w-5 h-5 text-sky-600" />}
          label="Sessions"
          value={isLoading ? "..." : overview?.sessions || 0}
          bg="bg-sky-50"
        />
        <KPIStatCard
          icon={<Eye className="w-5 h-5 text-emerald-600" />}
          label="Page Views"
          value={isLoading ? "..." : overview?.totalViews || 0}
          bg="bg-emerald-50"
        />
        <KPIStatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Avg. Session"
          value={isLoading ? "..." : formatDuration(overview?.avgSessionDuration)}
          bg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPIStatCard
          icon={<Users className="w-5 h-5 text-indigo-600" />}
          label="New Users"
          value={isLoading ? "..." : overview?.newUsers || 0}
          bg="bg-indigo-50"
        />
        <KPIStatCard
          icon={<Globe className="w-5 h-5 text-rose-600" />}
          label="Engagement Rate"
          value={isLoading ? "..." : formatPercent(overview?.engagementRate)}
          bg="bg-rose-50"
        />
      </div>

      <ChartCard
        title="Users & Sessions Over Time"
        subtitle="Daily active users, sessions, and page views"
        loading={isLoading}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#usersGradient)"
                name="Users"
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#sessionsGradient)"
                name="Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Traffic Sources"
          subtitle="Where your visitors are coming from"
          loading={isLoading}
        >
          {trafficSources.length === 0 ? (
            <EmptyState message="No traffic source data available yet" />
          ) : (
            <div className="space-y-2">
              {(trafficSources || []).slice(0, 10).map((source, index) => (
                <div
                  key={`${source.source}-${source.medium}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-300 w-5 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {source.source || "(direct)"}
                    </p>
                    <p className="text-xs text-gray-400">{source.medium}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {source.sessions}
                    </p>
                    <p className="text-xs text-gray-400">sessions</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Top Pages"
          subtitle="Most viewed pages on your site"
          loading={isLoading}
        >
          {topPages.length === 0 ? (
            <EmptyState message="No page view data available yet" />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(topPages || []).slice(0, 15).map((page, index) => (
                <div
                  key={page.pagePath}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-300 w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {page.pageTitle}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-mono">
                      {page.pagePath}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {page.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Top Products by Views"
          subtitle="Most visited product pages"
          loading={isLoading}
        >
          {topProducts.length === 0 ? (
            <EmptyState message="No product view data available yet" />
          ) : (
            <div className="space-y-2">
              {(topProducts || []).slice(0, 10).map((product, index) => (
                <div
                  key={product.pagePath}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-300 w-5 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.pageTitle}
                    </p>
                    <p className="text-xs text-gray-400 truncate font-mono">
                      {product.pagePath}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {product.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Traffic Source Breakdown"
          subtitle="Sessions by source/medium"
          loading={isLoading}
        >
          {trafficSources.length === 0 ? (
            <EmptyState message="No traffic data available yet" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(trafficSources || []).slice(0, 8)}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="source"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
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
                    formatter={(value) => [value, "Sessions"]}
                  />
                  <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                    {(trafficSources || []).slice(0, 8).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
