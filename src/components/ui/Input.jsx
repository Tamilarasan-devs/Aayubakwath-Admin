import { forwardRef } from "react";
import { clsx } from "clsx";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    required = false,
    type = "text",
    className = "",
    as: Component = "input",
    ...props
  },
  ref,
) {
  const baseClasses = clsx(
    "w-full rounded-xl border text-sm transition-all duration-200",
    "focus:outline-none focus:ring-0",
    "placeholder:text-gray-400",
    error
      ? "border-red-200 bg-red-50/50 focus:border-red-400 focus:bg-red-50"
      : "border-gray-200 bg-white hover:border-gray-300 focus:border-gray-900 focus:bg-white",
    icon && "pl-10",
    Component === "textarea" &&
      "resize-none min-h-[100px] leading-relaxed py-3",
    Component === "select" &&
      'appearance-none cursor-pointer py-2.5 pr-10 bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[right_12px_center] bg-no-repeat',
    Component === "input" && "py-2.5",
    className,
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <Component ref={ref} type={type} className={baseClasses} {...props} />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 font-medium">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
});
