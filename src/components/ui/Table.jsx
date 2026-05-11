import { clsx } from "clsx";
import { Skeleton } from "./Skeleton";

export function Table({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  className = "",
}) {
  if (loading) {
    return (
      <div
        className={clsx(
          "overflow-x-auto rounded-xl border border-gray-200 bg-white",
          className,
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/80 border-b border-gray-100">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={clsx("px-6 py-3 text-left", col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4">
                    <Skeleton variant="text" width={col.width || "80px"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm rounded-xl border border-gray-200 bg-white">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "overflow-x-auto rounded-xl border border-gray-200 bg-white",
        className,
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/80 border-b border-gray-100">
            {columns.map((col, i) => (
              <th
                key={i}
                className={clsx("px-6 py-3 text-left", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={clsx("px-6 py-4", col.className)}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
