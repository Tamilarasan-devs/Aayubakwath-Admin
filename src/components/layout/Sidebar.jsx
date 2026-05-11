import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Image,
  Megaphone,
  AlignStartHorizontal,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Truck,
  MessageSquare,
  TicketPercent,
  Mail,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        key: "analytics-revenue",
        label: "Revenue",
        path: "/analytics/revenue",
        icon: TrendingUp,
      },
      {
        key: "analytics-orders",
        label: "Orders",
        path: "/analytics/orders",
        icon: BarChart3,
      },
      {
        key: "analytics-products",
        label: "Products",
        path: "/analytics/products",
        icon: Package,
      },
      {
        key: "analytics-users",
        label: "Users",
        path: "/analytics/users",
        icon: Users,
      },
      {
        key: "analytics-cart",
        label: "Cart & Wishlist",
        path: "/analytics/cart-wishlist",
        icon: ShoppingCart,
      },
      {
        key: "analytics-categories",
        label: "Categories",
        path: "/analytics/categories",
        icon: Tags,
      },
    ],
  },
  {
    label: "Commerce",
    items: [
      { key: "products", label: "Products", path: "/products", icon: Package },
      {
        key: "categories",
        label: "Categories",
        path: "/categories",
        icon: Tags,
      },
      { key: "orders", label: "Orders", path: "/orders", icon: ClipboardList },
      {
        key: "coupons",
        label: "Coupons",
        path: "/coupons",
        icon: TicketPercent,
      },
    ],
  },
  {
    label: "Content",
    items: [
      { key: "banners", label: "Banners", path: "/banners", icon: Image },
      {
        key: "announcements",
        label: "Announcements",
        path: "/announcements",
        icon: Megaphone,
      },
      {
        key: "topbar",
        label: "Top Bar",
        path: "/topbar",
        icon: AlignStartHorizontal,
      },
      {
        key: "product-content",
        label: "Product Content",
        path: "/product-content",
        icon: FileText,
      },
    ],
  },
  {
    label: "System",
    items: [{ key: "users", label: "Users", path: "/users", icon: Users }],
  },
  {
    label: "Inquiries",
    items: [
      {
        key: "bulk-orders",
        label: "Orders",
        path: "/bulk-orders",
        icon: Truck,
      },
      {
        key: "contact-inquiries",
        label: "Contact",
        path: "/contact-inquiries",
        icon: MessageSquare,
      },
      {
        key: "newsletters",
        label: "Newsletters",
        path: "/newsletters",
        icon: Mail,
      },
    ],
  },
];

function NavItem({ item, active, collapsed, onClick }) {
  const Icon = item.icon;

  return (
    <li>
      <button
        onClick={onClick}
        className={clsx(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
          active
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
          collapsed && "justify-center px-0",
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </button>
    </li>
  );
}

export function Sidebar() {
  const { collapsed, toggleSidebar } = useSidebar();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = useMemo(() => {
    const path = location.pathname;
    for (const group of navGroups) {
      for (const item of group.items) {
        if (
          item.path === path ||
          (item.path !== "/" && path.startsWith(item.path))
        ) {
          return item.key;
        }
      }
    }
    return "dashboard";
  }, [location.pathname]);

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-200",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="shrink-0 px-4 py-5 border-b border-gray-100 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-none">
                Admin
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Management Panel
              </p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  active={activeKey === item.key}
                  collapsed={collapsed}
                  onClick={() => handleNav(item.path)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 px-3 py-4 border-t border-gray-100 space-y-0.5">
        <button
          className={clsx(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={logout}
          className={clsx(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors",
            collapsed && "justify-center px-0",
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
