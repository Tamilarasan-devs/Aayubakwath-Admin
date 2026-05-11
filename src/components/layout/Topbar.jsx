import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const routeLabels = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/new": "New Product",
  "/categories": "Categories",
  "/orders": "Orders",
  "/users": "Users",
  "/banners": "Banners",
  "/announcements": "Announcements",
  "/topbar": "Top Bar",
  "/product-content": "Product Content",
};

export function Topbar({ onMobileMenuOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/products/") && path.endsWith("/edit")) {
      return "Edit Product";
    }
    return routeLabels[path] || "Dashboard";
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return ["Admin", "Dashboard"];
    const segments = path.split("/").filter(Boolean);
    return [
      "Admin",
      ...segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    ];
  }, [location.pathname]);

  return (
    <header className="shrink-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-4">
      <button
        className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
        onClick={onMobileMenuOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      <nav className="hidden sm:flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">/</span>}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "font-semibold text-gray-900"
                  : "text-gray-400"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <span className="sm:hidden font-semibold text-gray-900 text-sm">
        {pageTitle}
      </span>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
          />
        </div>

        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {(user.name || user.email || "A")[0].toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {user.name || user.email}
              </p>
              <p className="text-[11px] text-gray-400">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
