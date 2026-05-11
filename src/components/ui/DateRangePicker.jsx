import { clsx } from "clsx";

const ranges = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "1y", label: "1Y" },
];

export function DateRangePicker({ value = "30d", onChange, className = "" }) {
  return (
    <div className={clsx("inline-flex bg-gray-100 rounded-xl p-1", className)}>
      {ranges.map((r) => (
        <button
          key={r.key}
          onClick={() => onChange(r.key)}
          className={clsx(
            "px-4 py-2 text-xs font-semibold rounded-lg transition-all",
            value === r.key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
