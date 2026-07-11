import { useEffect, useRef, useState } from "react";
import {
  FaBox,
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaTags,
  FaExclamationTriangle,
} from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

import { useStore } from "../hooks/useStore";
import { useOrders } from "../hooks/useOrders";

function Dashboard() {
  const { products, categories } = useStore();
  const { orders, totalRevenue } = useOrders();

  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const previousOrdersCount = useRef(0);

  const notificationSound = useRef(null);
  const audioUnlocked = useRef(false);

  // تجهيز الصوت
  useEffect(() => {
    notificationSound.current = new Audio("/sounds/order.mp3");
    notificationSound.current.volume = 1;

    const unlockAudio = () => {
      if (audioUnlocked.current) return;

      notificationSound.current
        ?.play()
        .then(() => {
          notificationSound.current.pause();
          notificationSound.current.currentTime = 0;

          audioUnlocked.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // مراقبة الطلبات الجديدة
  useEffect(() => {
    console.log("orders:", orders.length);
    console.log("previous:", previousOrdersCount.current);

    if (previousOrdersCount.current === 0) {
      previousOrdersCount.current = orders.length;
      return;
    }

    if (orders.length > previousOrdersCount.current) {
      console.log("🚨 تم اكتشاف طلب جديد");

      const diff = orders.length - previousOrdersCount.current;

      setNewOrdersCount((prev) => prev + diff);

      notificationSound.current?.play().catch(console.error);
    }

    previousOrdersCount.current = orders.length;
  }, [orders]);
  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending",
  ).length;

  const latestProducts = [...products].reverse().slice(0, 5);

  const latestOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar newOrdersCount={newOrdersCount} />

      <main className="flex-1 p-8">
        <Header />

        {newOrdersCount > 0 && (
          <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-blue-700">🔔 طلبات جديدة</h3>

                <p className="mt-1 text-gray-600">
                  لديك {newOrdersCount} طلب جديد
                </p>
              </div>

              <button
                onClick={() => setNewOrdersCount(0)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                تم
              </button>
            </div>
          </div>
        )}

        {/* الإحصائيات */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500">المنتجات</h3>

                <p className="mt-3 text-4xl font-bold text-green-700">
                  {products.length}
                </p>
              </div>

              <FaBox className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-500">الطلبات</h3>

                  {newOrdersCount > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs text-white animate-pulse">
                      {newOrdersCount}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-4xl font-bold text-blue-600">
                  {orders.length}
                </p>
              </div>

              <FaShoppingCart className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500">المبيعات</h3>

                <p className="mt-3 text-4xl font-bold text-orange-500">
                  {totalRevenue.toLocaleString()} ر.س
                </p>
              </div>

              <FaMoneyBillWave className="text-4xl text-orange-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500">قيد الانتظار</h3>

                <p className="mt-3 text-4xl font-bold text-red-600">
                  {pendingOrdersCount}
                </p>
              </div>

              <FaClock className="text-4xl text-red-500" />
            </div>
          </div>
        </div>

        {/* إحصائيات ثانوية */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500">التصنيفات</h3>

                <p className="mt-3 text-3xl font-bold text-purple-600">
                  {categories.length}
                </p>
              </div>

              <FaTags className="text-4xl text-purple-500" />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500">مخزون منخفض</h3>

                <p className="mt-3 text-3xl font-bold text-red-500">
                  {lowStockProducts.length}
                </p>
              </div>

              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h3 className="mb-5 text-xl font-bold">أحدث المنتجات</h3>

            <div className="space-y-4">
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>

                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>

                  <span className="font-bold text-green-600">
                    {product.price} ر.س
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* أحدث الطلبات هنا */}
        </div>
        {/* أحدث الطلبات */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow">
          <h3 className="mb-5 text-xl font-bold">أحدث الطلبات</h3>

          <div className="space-y-4">
            {latestOrders.length === 0 ? (
              <p className="text-gray-500">لا توجد طلبات.</p>
            ) : (
              latestOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">
                      {order.customer?.name || "عميل"}
                    </p>

                    <p className="text-sm text-gray-500">{order.status}</p>
                  </div>

                  <span className="font-bold text-blue-600">
                    {order.total} ر.س
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
