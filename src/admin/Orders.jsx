import { useMemo, useState } from "react";
import { FaEye, FaTimes } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

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

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 rounded-2xl bg-white shadow">
          <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl font-bold">الطلبات</h2>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  !statusFilter
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                الكل ({orders.length})
              </button>

              {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    statusFilter === key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label} ({orders.filter((o) => o.status === key).length})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-right">رقم الطلب</th>
                  <th className="p-4 text-right">العميل</th>
                  <th className="p-4 text-right">التاريخ</th>
                  <th className="p-4 text-center">الإجمالي</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t transition hover:bg-gray-50"
                    >
                      <td className="p-4 font-semibold">{order.orderNumber}</td>

                      <td className="p-4">
                        <p className="font-medium">
                          {order.customer?.name || "بدون اسم"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customer?.phone || ""}
                        </p>
                      </td>

                      <td className="p-4 text-sm text-gray-500">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString("ar-SA")
                          : new Date(order.date).toLocaleDateString("ar-SA")}
                      </td>

                      <td className="p-4 text-center font-semibold">
                        {order.total.toFixed(2)} ر.س
                      </td>

                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className={`rounded-full border-0 px-3 py-1 text-sm font-medium outline-none ${STATUS_COLORS[order.status]}`}
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

                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-500">
                      لا توجد طلبات.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                طلب {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4 rounded-xl bg-gray-50 p-4 text-sm">
              <p>
                <span className="font-semibold">الاسم: </span>
                {selectedOrder.customer?.name || "-"}
              </p>
              <p>
                <span className="font-semibold">الجوال: </span>
                {selectedOrder.customer?.phone || "-"}    
              </p>
              <p>
                <span className="font-semibold">المدينة: </span>
                {selectedOrder.customer?.city || "-"}
              </p>
              <p>
                <span className="font-semibold">العنوان: </span>
                {selectedOrder.customer?.address || "-"}
              </p>
              {selectedOrder.customer?.notes && (
                <p>
                  <span className="font-semibold">ملاحظات: </span>
                  {selectedOrder.customer.notes}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b pb-3 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {item.price} ر.س
                    </p>
                  </div>
                  <p className="text-sm font-bold">
                    {(item.price * item.quantity).toFixed(2)} ر.س
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>الإجمالي</span>
              <span>{selectedOrder.total.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
