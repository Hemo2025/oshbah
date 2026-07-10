import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaPhone, FaStickyNote } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";

const emptyCustomer = { name: "", phone: "", city: "", address: "", notes: "" };

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(emptyCustomer);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cartItems.length === 0 && !orderPlaced) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!customer.name.trim()) newErrors.name = "الاسم مطلوب.";
    if (!customer.phone.trim()) newErrors.phone = "رقم الجوال مطلوب.";
    else if (!/^0?5\d{8}$/.test(customer.phone.trim().replace(/\s/g, "")))
      newErrors.phone = "رقم جوال سعودي غير صحيح (مثال: 05xxxxxxxx).";
    if (!customer.city.trim()) newErrors.city = "المدينة مطلوبة.";
    if (!customer.address.trim()) newErrors.address = "العنوان مطلوب.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    const order = createOrder({
      customer,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || "",
      })),
      total: cartTotal,
    });

    // Mark the order as placed BEFORE clearing the cart, so the empty-cart
    // guard above doesn't race with clearCart() and redirect back to /cart.
    setOrderPlaced(true);
    clearCart();
    navigate(`/order-confirmation/${order.orderNumber}`, { replace: true });
  };

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800">
          إتمام الطلب 🧾
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow lg:col-span-2"
          >
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              بيانات الشحن
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                    placeholder="اسمك الكامل"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رقم الجوال *
                </label>
                <div className="relative">
                  <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                    placeholder="05xxxxxxxx"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  المدينة *
                </label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="مثال: جدة"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  العنوان التفصيلي *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                    placeholder="الحي، الشارع، رقم المبنى"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  ملاحظات (اختياري)
                </label>
                <div className="relative">
                  <FaStickyNote className="absolute right-4 top-4 text-gray-400" />
                  <textarea
                    value={customer.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                    placeholder="أي تعليمات إضافية للتوصيل"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
              الدفع عند الاستلام حالياً. سيتم إضافة وسائل دفع إلكترونية لاحقاً.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "جارِ تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
          </form>

          {/* Order summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold text-gray-800">ملخص الطلب</h2>

            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {item.price} ر.س
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between border-t pt-4 text-lg font-bold text-gray-800">
              <span>الإجمالي</span>
              <span>{cartTotal.toFixed(2)} ر.س</span>
            </div>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm text-gray-500 hover:text-green-600"
            >
              تعديل السلة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
