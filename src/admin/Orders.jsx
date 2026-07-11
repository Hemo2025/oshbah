import { useMemo, useState } from "react";
import { FaEye, FaTimes, FaPrint } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";
import { useNavigate } from "react-router-dom";
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function Orders() {
  const { orders, updateOrderStatus } = useOrders();

  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = !statusFilter || order.status === statusFilter;

      const text = `
        ${order.orderNumber || ""}
        ${order.customer?.name || ""}
        ${order.customer?.phone || ""}
        `.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const totalSales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <h1 className="mt-8 text-3xl font-bold text-gray-800">إدارة الطلبات</h1>

        {/* الإحصائيات */}

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-yellow-50 p-5">
            <p className="text-gray-600">طلبات جديدة</p>

            <h3 className="text-3xl font-bold">
              {orders.filter((o) => o.status === "pending").length}
            </h3>
          </div>

          <div className="rounded-xl bg-blue-50 p-5">
            <p className="text-gray-600">قيد التنفيذ</p>

            <h3 className="text-3xl font-bold">
              {orders.filter((o) => o.status === "processing").length}
            </h3>
          </div>

          <div className="rounded-xl bg-green-50 p-5">
            <p className="text-gray-600">المبيعات</p>

            <h3 className="text-2xl font-bold">{totalSales.toFixed(2)} ر.س</h3>
          </div>

          <div className="rounded-xl bg-gray-200 p-5">
            <p className="text-gray-600">جميع الطلبات</p>

            <h3 className="text-3xl font-bold">{orders.length}</h3>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
          <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-2xl font-bold">الطلبات</h2>

            <input
              type="text"
              placeholder="بحث برقم الطلب أو اسم العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                rounded-xl border p-3
                outline-none
                focus:border-green-600
              "
            />
          </div>

          <div className="flex flex-wrap gap-2 p-6">
            <button
              onClick={() => setStatusFilter("")}
              className={`
                rounded-full px-4 py-2 text-sm
                ${!statusFilter ? "bg-green-600 text-white" : "bg-gray-100"}
              `}
            >
              الكل ({orders.length})
            </button>

            {Object.entries(ORDER_STATUSES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`
                    rounded-full px-4 py-2 text-sm
                    ${
                      statusFilter === key
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }
                  `}
              >
                {label}({orders.filter((o) => o.status === key).length})
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-right">رقم الطلب</th>

                  <th className="p-4 text-right">العميل</th>

                  <th className="p-4 text-center">المنتجات</th>

                  <th className="p-4 text-right">التاريخ</th>

                  <th className="p-4 text-center">الإجمالي</th>

                  <th className="p-4 text-center">الحالة</th>

                  <th className="p-4 text-center">عرض</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="
                        border-t
                        transition
                        hover:bg-gray-50
                      "
                    >
                      <td className="p-4 font-bold">{order.orderNumber}</td>

                      <td className="p-4">
                        <p className="font-semibold">
                          {order.customer?.name || "-"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customer?.phone || "-"}
                        </p>
                      </td>

                      <td className="text-center">
                        {order.items?.length || 0}
                      </td>

                      <td className="p-4 text-sm text-gray-500">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString("ar-SA")
                          : "-"}
                      </td>

                      <td className="text-center font-bold">
                        {Number(order.total || 0).toFixed(2)} ر.س
                      </td>

                      <td className="text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className={`
                            rounded-full border-0 px-3 py-1
                            ${STATUS_COLORS[order.status]}
                          `}
                        >
                          {Object.entries(ORDER_STATUSES).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </td>

                      <td className="text-center">
                        <button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="
                            rounded-lg
                            bg-blue-600
                            p-3
                            text-white
                          "
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">
                      لا توجد طلبات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50 p-4
          "
        >
          <div
            className="
              max-h-[90vh]
              w-full max-w-lg
              overflow-y-auto
              rounded-2xl
              bg-white
              p-6
            "
          >
            <div
              className="
                mb-5 flex items-center justify-between
              "
            >
              <h2 className="text-xl font-bold">
                طلب {selectedOrder.orderNumber}
              </h2>

              <button onClick={() => setSelectedOrder(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p>الاسم: {selectedOrder.customer?.name}</p>

              <p>الجوال: {selectedOrder.customer?.phone}</p>

              <p>المدينة: {selectedOrder.customer?.city}</p>

              <p>العنوان: {selectedOrder.customer?.address}</p>
            </div>

            <hr className="my-5" />

            {selectedOrder.items?.map((item) => (
              <div
                key={item.id}
                className="
                      flex items-center gap-3
                      border-b py-3
                    "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                        h-14 w-14
                        rounded-lg
                        object-cover
                      "
                />

                <div className="flex-1">
                  <p className="font-bold">{item.name}</p>

                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price} ر.س
                  </p>
                </div>
              </div>
            ))}

            <div
              className="
                mt-5 flex justify-between
                border-t pt-4 font-bold
              "
            >
              <span>الإجمالي</span>

              <span>{Number(selectedOrder.total || 0).toFixed(2)} ر.س</span>
            </div>

            <button
              onClick={() => window.print()}
              className="
                  mt-5 flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  py-3
                  text-white
                "
            >
              <FaPrint />
              طباعة الطلب
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
