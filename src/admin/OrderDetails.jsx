import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaTrash,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBox,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";
import OrderInvoice from "../components/admin/OrderInvoice";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";
import WhatsAppButton from "../components/admin/WhatsAppButton";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { getOrderById, updateOrderStatus, deleteOrder } = useOrders();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <Header />

          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-bold">الطلب غير موجود</h2>
          </div>
        </main>
      </div>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleDelete = async () => {
    await deleteOrder(order.id);

    navigate("/admin/orders");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-6 flex items-center gap-2 text-gray-600 hover:text-green-600"
        >
          <FaArrowRight />
          العودة للطلبات
        </button>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow">
          {/* Header */}

          <div className="flex flex-col gap-5 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                طلب #{order.orderNumber}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />

                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString("ar-SA")
                    : new Date(order.date).toLocaleString("ar-SA")}
                </span>

                <span className="flex items-center gap-2">
                  <FaBox />
                  {totalItems} منتجات
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className={`
                  rounded-full px-5 py-2 font-bold outline-none
                  ${STATUS_COLORS[order.status]}
                `}
              >
                {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <OrderInvoice order={order} />
              <WhatsAppButton phone={order.customer.phone} order={order} />

              <button
                onClick={() => setShowDeleteModal(true)}
                className="
                flex items-center gap-2 rounded-xl
                bg-red-600 px-5 py-2
                text-white transition
                hover:bg-red-700
                "
              >
                <FaTrash />
                حذف الطلب
              </button>
            </div>
          </div>

          {/* Customer */}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-6">
              <h2 className="mb-5 text-lg font-bold">بيانات العميل</h2>

              <div className="space-y-4 text-gray-700">
                <p className="flex gap-3">
                  <FaUser className="text-green-600" />

                  {order.customer?.name}
                </p>

                <p className="flex gap-3">
                  <FaPhone className="text-green-600" />

                  {order.customer?.phone}
                </p>

                <p className="flex gap-3">
                  <FaMapMarkerAlt className="text-green-600" />

                  {order.customer?.city}
                </p>

                <p className="rounded-xl bg-white p-3 text-sm">
                  {order.customer?.address}
                </p>

                {order.customer?.notes && (
                  <p className="rounded-xl bg-yellow-50 p-3 text-sm">
                    ملاحظات:
                    <br />
                    {order.customer.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}

            <div className="rounded-2xl bg-gray-50 p-6 lg:col-span-2">
              <h2 className="mb-5 text-lg font-bold">المنتجات</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-right text-gray-500">
                      <th className="p-3">المنتج</th>

                      <th className="p-3">السعر</th>

                      <th className="p-3">الكمية</th>

                      <th className="p-3">الإجمالي</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="flex items-center gap-3 p-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="
                              h-16 w-16 rounded-xl
                              object-cover
                              "
                          />

                          <span className="font-semibold">{item.name}</span>
                        </td>

                        <td className="p-3">{item.price} ر.س</td>

                        <td className="p-3">
                          <span
                            className="
                            rounded-lg bg-green-100
                            px-3 py-1 font-bold text-green-700
                            "
                          >
                            {item.quantity}
                          </span>
                        </td>

                        <td className="p-3 font-bold">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Total */}

          <div
            className="
          mt-8 flex items-center justify-between
          rounded-2xl bg-green-50 p-6
          "
          >
            <div className="flex items-center gap-3 text-xl font-bold">
              <FaMoneyBillWave className="text-green-600" />
              الإجمالي
            </div>

            <div className="text-3xl font-bold text-green-700">
              {order.total.toFixed(2)} ر.س
            </div>
          </div>
        </div>
        {/* Order History */}

        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-6 text-lg font-bold">سجل الطلب</h2>

          <div className="space-y-5">
            {order.history?.length > 0 ? (
              [...order.history].reverse().map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className="
            mt-1 h-4 w-4
            rounded-full
            bg-green-600
            "
                  />

                  <div>
                    <p className="font-bold text-gray-800">
                      {ORDER_STATUSES[item.status]}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleString("ar-SA")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">لا يوجد سجل للحالة</p>
            )}
          </div>
        </div>
        {/* Delete Modal */}

        {showDeleteModal && (
          <div
            className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/50 p-5
          "
          >
            <div
              className="
            w-full max-w-md
            rounded-3xl bg-white p-6 text-center
            "
            >
              <FaExclamationTriangle
                className="
                mx-auto mb-4 text-5xl text-red-500
                "
              />

              <h2 className="text-xl font-bold">حذف الطلب؟</h2>

              <p className="mt-3 text-gray-500">
                هل أنت متأكد من حذف الطلب {order.orderNumber}؟
                <br />
                لا يمكن التراجع عن هذا الإجراء.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="
                  flex-1 rounded-xl
                  bg-gray-200 py-3 font-bold
                  "
                >
                  إلغاء
                </button>

                <button
                  onClick={handleDelete}
                  className="
                  flex-1 rounded-xl
                  bg-red-600 py-3 font-bold text-white
                  "
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
