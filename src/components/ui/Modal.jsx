import { useEffect, useCallback } from "react";
import { clsx } from "clsx";

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  className = "",
}) {
  const handleEsc = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn",
          className,
        )}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {actions && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
