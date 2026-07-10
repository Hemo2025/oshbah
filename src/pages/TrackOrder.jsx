import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBoxOpen, FaChevronDown } from "react-icons/fa";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES } from "../context/order-statuses";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between p-5 text-right"
      >
        <div>
          <p className="font-bold text-gray-800">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.date).toLocaleDateString("ar-SA")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[order.status]}`}
          >
            {ORDER_STATUSES[order.status]}
          </span>
          <span className="font-bold text-gray-800">
            {order.total.toFixed(2)} ر.س
          </span>
          <FaChevronDown
            className={`text-gray-400 transition ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t p-5">
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
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

          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            <p>
              التوصيل إلى: {order.customer.city} — {order.customer.address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrder() {
  const { myOrders, findOrder } = useOrders();

  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState(undefined); // undefined = no search yet, null = not found

  const handleSearch = (e) => {
    e.preventDefault();
    const result = findOrder(orderNumber, phone);
    setSearchResult(result);
  };

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-2 text-center text-4xl font-bold text-gray-800">
          متابعة الطلب 📦
        </h1>
        <p className="mb-10 text-center text-gray-500">
          تقدر تتابع حالة طلبك برقم الطلب ورقم الجوال، بدون تسجيل دخول
        </p>

        {/* Manual lookup */}
        <form
          onSubmit={handleSearch}
          className="mb-10 rounded-2xl bg-white p-6 shadow"
        >
          <h2 className="mb-4 font-bold text-gray-800">البحث عن طلب برقمه</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="رقم الطلب (مثال: ORD-1001)"
              className="rounded-xl border p-3 outline-none focus:border-green-600"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الجوال المستخدم بالطلب"
              className="rounded-xl border p-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700"
          >
            <FaSearch /> بحث
          </button>

          {searchResult === null && (
            <p className="mt-4 text-center text-red-600">
              ما لقينا طلب مطابق لرقم الطلب والجوال المدخلين.
            </p>
          )}

          {searchResult && (
            <div className="mt-6">
              <OrderCard order={searchResult} />
            </div>
          )}
        </form>

        {/* Orders remembered on this device */}
        <div>
          <h2 className="mb-4 font-bold text-gray-800">طلباتك من هذا الجهاز</h2>

          {myOrders.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
              <FaBoxOpen className="mx-auto mb-4 text-5xl text-gray-300" />
              <p className="text-gray-500">
                ما فيه طلبات سابقة من هذا الجهاز والمتصفح.
              </p>
              <Link
                to="/products"
                className="mt-4 inline-block rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
              >
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
