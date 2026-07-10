import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useStore } from "../hooks/useStore";
import { useOrders } from "../hooks/useOrders";

function Dashboard() {
  const { products, categories } = useStore();
  const { orders, totalRevenue } = useOrders();

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending",
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">المنتجات</h3>

            <p className="mt-3 text-4xl font-bold text-green-700">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">الطلبات</h3>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">المبيعات</h3>

            <p className="mt-3 text-4xl font-bold text-orange-500">
              {totalRevenue.toLocaleString()} ر.س
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">طلبات قيد الانتظار</h3>

            <p className="mt-3 text-4xl font-bold text-red-600">
              {pendingOrdersCount}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">التصنيفات</h3>
            <p className="mt-3 text-3xl font-bold text-purple-600">
              {categories.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-gray-500">منتجات مخزونها منخفض</h3>
            <p className="mt-3 text-3xl font-bold text-red-500">
              {lowStockCount}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
