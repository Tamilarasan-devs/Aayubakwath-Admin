import { Card, CardBody } from "./Card";
import { Skeleton } from "./Skeleton";

export function ChartCard({
  title,
  subtitle,
  children,
  loading,
  className = "",
}) {
  return (
    <Card variant="elevated" className={className}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <CardBody>
        {loading ? (
          <div className="space-y-3">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </div>
        ) : (
          children
        )}
      </CardBody>
    </Card>
  );
}
