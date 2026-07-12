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

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import OrderInvoice from "../components/admin/OrderInvoice";
import WhatsAppButton from "../components/admin/WhatsAppButton";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-sky-100 text-sky-700",
  shipped: "bg-violet-100 text-violet-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
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

        <main className="flex-1 p-4 md:p-8">
          <Header />

          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-bold">الطلب غير موجود</h2>
          </div>
        </main>
      </div>
    );
  }

  const totalItems =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  const handleDelete = async () => {
    await deleteOrder(order.id);
    navigate("/admin/orders");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Header />

        <button
          onClick={() => navigate("/admin/orders")}
          className="
            mt-6 flex items-center gap-2
            text-gray-600 transition
            hover:text-green-600
          "
        >
          <FaArrowRight />
          العودة للطلبات
        </button>

        <div className="mt-6 rounded-3xl bg-white p-4 shadow md:p-6">
          {/* Header */}

          <div
            className="
              flex flex-col gap-6
              border-b pb-6
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                طلب #{order.orderNumber}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />

                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString("ar-SA")
                    : "-"}
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
                  rounded-full px-5 py-2 font-bold
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

              <WhatsAppButton phone={order.customer?.phone} order={order} />

              <button
                onClick={() => setShowDeleteModal(true)}
                className="
                  flex items-center gap-2
                  rounded-xl bg-red-600
                  px-5 py-2 text-white
                  transition hover:bg-red-700
                "
              >
                <FaTrash />
                حذف الطلب
              </button>
            </div>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-gray-500">عدد المنتجات</p>

              <h3 className="mt-2 text-3xl font-bold">{totalItems}</h3>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <p className="text-gray-500">حالة الطلب</p>

              <h3 className="mt-2 text-xl font-bold">
                {ORDER_STATUSES[order.status]}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-gray-500">قيمة الطلب</p>

              <h3 className="mt-2 text-3xl font-bold">
                {Number(order.total || 0).toFixed(2)} ر.س
              </h3>
            </div>
          </div>

          {/* Customer + Products */}

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Customer */}

            <div className="rounded-3xl bg-gray-50 p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold">بيانات العميل</h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-green-600" />

                    <div>
                      <p className="text-xs text-gray-500">اسم العميل</p>

                      <p className="font-semibold">{order.customer?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600" />

                    <div>
                      <p className="text-xs text-gray-500">الهاتف</p>

                      <p className="font-semibold">{order.customer?.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-green-600" />

                    <div>
                      <p className="text-xs text-gray-500">المدينة</p>

                      <p className="font-semibold">{order.customer?.city}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-500">العنوان</p>

                  <p className="mt-2">{order.customer?.address}</p>
                </div>
              </div>
            </div>

            {/* Products */}

            <div className="rounded-3xl bg-gray-50 p-6 lg:col-span-2">
              <h2 className="mb-5 text-lg font-bold">المنتجات</h2>

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="
                        rounded-2xl bg-white
                        p-4 shadow-sm
                      "
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                            h-20 w-20
                            rounded-xl
                            object-cover
                          "
                      />

                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>

                        <div className="mt-3 space-y-1 text-sm text-gray-500">
                          <p>
                            السعر:
                            {item.price} ر.س
                          </p>

                          <p>
                            الكمية:
                            {item.quantity}
                          </p>
                        </div>

                        <p className="mt-3 font-bold text-green-700">
                          {(item.price * item.quantity).toFixed(2)} ر.س
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total */}

          <div
            className="
              mt-8 flex flex-col gap-4
              rounded-3xl
              bg-gradient-to-r
              from-green-50
              to-emerald-50
              p-6 md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div className="flex items-center gap-3 text-xl font-bold">
              <FaMoneyBillWave className="text-green-600" />
              الإجمالي
            </div>

            <div className="text-3xl font-bold text-green-700">
              {Number(order.total || 0).toFixed(2)} ر.س
            </div>
          </div>

          {/* History */}

          <div className="mt-8 rounded-3xl bg-white p-6 shadow">
            <h2 className="mb-6 text-lg font-bold">سجل الطلب</h2>

            <div className="space-y-5">
              {order.history?.length > 0 ? (
                [...order.history].reverse().map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-4 w-4 rounded-full bg-green-600 mt-1" />

                    <div>
                      <p className="font-bold">{ORDER_STATUSES[item.status]}</p>

                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleString("ar-SA")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">لا يوجد سجل</p>
              )}
            </div>
          </div>
        </div>

        {/* Delete Modal */}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-2xl">
              <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-red-500" />

              <h2 className="text-xl font-bold">حذف الطلب؟</h2>

              <p className="mt-3 text-gray-500">
                هل أنت متأكد من حذف الطلب
                {order.orderNumber}؟
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl bg-gray-200 py-3 font-bold"
                >
                  إلغاء
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white"
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
