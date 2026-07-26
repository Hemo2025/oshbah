import { useState } from "react";

import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";

function AdminLayout({ children, newOrdersCount = 0 }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay للجوال */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        newOrdersCount={newOrdersCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* المحتوى */}
      <div className="min-h-screen lg:mr-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
