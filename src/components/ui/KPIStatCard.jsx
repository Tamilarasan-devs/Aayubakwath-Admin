import { clsx } from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KPIStatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  bg,
  prefix = "",
  suffix = "",
}) {
  const positive = change >= 0;
  const hasChange = change !== null && change !== undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={clsx(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            bg,
          )}
        >
          {icon}
        </div>
        {hasChange && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
              positive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500",
            )}
          >
            {positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight mb-0.5">
        {prefix}
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        {suffix}
      </p>
      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
        {label}
      </p>
      {changeLabel && (
        <p className="text-[10px] text-gray-300 mt-1">{changeLabel}</p>
      )}
    </div>
  );
}
