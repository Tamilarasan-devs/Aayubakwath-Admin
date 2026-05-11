import { clsx } from "clsx";

const gradients = [
  "from-violet-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-500",
  "from-rose-400 to-pink-500",
];

const sizes = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export function Avatar({ name, src, size = "md", className = "" }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const gradientIndex = name
    ? name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      gradients.length
    : 0;

  return (
    <div
      className={clsx(
        "rounded-full flex items-center justify-center font-semibold text-white shrink-0 bg-gradient-to-br",
        gradients[gradientIndex],
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}
