import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusSquare,
  FaShoppingCart,
  FaTags,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";

function Sidebar({ newOrdersCount = 0 }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const menu = [
    {
      name: "لوحة التحكم",
      icon: <FaTachometerAlt />,
      path: "/admin/dashboard",
    },
    {
      name: "المنتجات",
      icon: <FaBoxOpen />,
      path: "/admin/products",
    },
    {
      name: "إضافة منتج",
      icon: <FaPlusSquare />,
      path: "/admin/add-product",
    },
    {
      name: "الطلبات",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
      badge: newOrdersCount,
    },
    {
      name: "التصنيفات",
      icon: <FaTags />,
      path: "/admin/categories",
    },
    {
      name: "الإعدادات",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col bg-green-700 text-white">
      <div className="border-b border-green-600 p-6 text-center">
        <h1 className="text-3xl font-bold">🌿 عشبة ستور</h1>

        <p className="mt-2 text-sm text-green-100">لوحة التحكم</p>
      </div>

      <nav className="flex-1 p-4">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mb-3 flex items-center justify-between rounded-xl px-4 py-3 transition ${
                isActive ? "bg-white text-green-700" : "hover:bg-green-600"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>

              <span>{item.name}</span>
            </div>

            {item.badge > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs text-white animate-pulse">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-green-600 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-red-500"
        >
          <FaSignOutAlt />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
