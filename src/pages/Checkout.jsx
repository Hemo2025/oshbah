import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import {
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaStickyNote,
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
} from "react-icons/fa";

import { useCart } from "../hooks/useCart";
import { useOrders } from "../hooks/useOrders";
import { trackEvent } from "../lib/metaPixel";
const emptyCustomer = {
  name: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [customer, setCustomer] = useState(() => {
    try {
      const savedCustomer = localStorage.getItem("checkoutCustomer");

      return savedCustomer ? JSON.parse(savedCustomer) : emptyCustomer;
    } catch {
      return emptyCustomer;
    }
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = settings?.shipping?.shippingFee || 0;

  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 0;

  const shippingCost =
    freeShippingThreshold > 0 && cartTotal >= freeShippingThreshold
      ? 0
      : shippingFee;

  const finalTotal = cartTotal + shippingCost;
  useEffect(() => {
    if (!cartItems.length) return;

    trackEvent("InitiateCheckout", {
      content_ids: cartItems.map((item) => item.id),
      content_type: "product",
      num_items: cartItems.reduce((total, item) => total + item.quantity, 0),
      value: finalTotal,
      currency: "SAR",
    });
  }, [cartItems, finalTotal]);
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }
  const handleChange = (field, value) => {
    const updatedCustomer = {
      ...customer,
      [field]: value,
    };

    setCustomer(updatedCustomer);

    localStorage.setItem("checkoutCustomer", JSON.stringify(updatedCustomer));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);

    try {
      const order = await createOrder({
        customer,

        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),

        subtotal: cartTotal,
        shipping: shippingCost,
        total: finalTotal,
      });
      console.log("ORDER:", order);

      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      });

      const data = await response.json();

      trackEvent("Purchase", {
        content_ids: order.items.map((item) => item.id),
        content_type: "product",
        num_items: order.items.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
        value: Number(order.total),
        currency: "SAR",
      });

      console.log("EMAIL RESPONSE:", data);

      const myOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

      if (!myOrders.includes(order.orderNumber)) {
        myOrders.push(order.orderNumber);

        localStorage.setItem("myOrders", JSON.stringify(myOrders));
      }
      clearCart();

      navigate(`/order-confirmation/${order.orderNumber}`, {
        replace: true,
        state: { order },
      });
    } catch (error) {
      console.error("Create Order Error:", error);

      alert("حدث خطأ أثناء تأكيد الطلب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-green-50 via-white to-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* العنوان */}
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          إتمام الطلب 🧾
        </h1>

        {/* خطوات الطلب */}
        <div className="mb-12 flex items-center justify-center gap-2 text-xs font-semibold md:text-sm">
          <div className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white">
            <FaShoppingBag />
            السلة
          </div>

          <div className="h-[2px] w-8 bg-green-300 md:w-12" />

          <div className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white">
            <FaTruck />
            إتمام الطلب
          </div>

          <div className="h-[2px] w-8 bg-gray-300 md:w-12" />

          <div className="flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-gray-500">
            <FaCheckCircle />
            التأكيد
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* نموذج الشحن */}
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="mb-8 text-2xl font-bold text-gray-800">
              بيانات الشحن
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* الاسم */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  الاسم الكامل *
                </label>

                <div className="relative">
                  <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-4 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* الجوال */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رقم الجوال *
                </label>

                <div className="relative">
                  <FaPhone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-4 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* المدينة */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  المدينة *
                </label>

                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="مثال: جدة"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

                {errors.city && (
                  <p className="mt-2 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              {/* العنوان */}
              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  العنوان التفصيلي *
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="الحي، الشارع، رقم المبنى"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-4 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {errors.address && (
                  <p className="mt-2 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* الملاحظات */}
              <div className="sm:col-span-2">
                <label className="mb-2 block font-semibold text-gray-700">
                  ملاحظات (اختياري)
                </label>

                <div className="relative">
                  <FaStickyNote className="absolute right-5 top-5 text-gray-400" />

                  <textarea
                    rows={4}
                    value={customer.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="أي تعليمات إضافية للتوصيل"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-12 pl-4 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </div>
            </div>

            {/* تنبيه الدفع */}
            <div className="mt-8 rounded-2xl bg-green-50 p-4 text-sm text-green-700">
              💵 الدفع عند الاستلام متاح حالياً، وسيتم إضافة وسائل الدفع
              الإلكتروني قريباً.
            </div>

            {/* زر التأكيد */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "جارِ تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
          </form>

          {/* ملخص الطلب */}
          <div className="sticky top-24 h-fit rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              ملخص الطلب
            </h2>

            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3"
                >
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {item.quantity} × {item.price} ر.س
                    </p>
                  </div>

                  <p className="font-bold text-gray-800">
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-gray-500">
              <span>الشحن</span>

              <span
                className={`font-semibold ${
                  shippingCost === 0 ? "text-green-600" : "text-gray-800"
                }`}
              >
                {shippingCost === 0
                  ? "مجاني"
                  : `${shippingCost.toFixed(2)} ر.س`}
              </span>
            </div>

            {/* تنبيه الشحن */}
            {shippingCost === 0 && freeShippingThreshold > 0 && (
              <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                🎉 حصلت على شحن مجاني
              </div>
            )}

            {shippingCost > 0 && freeShippingThreshold > 0 && (
              <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                أضف منتجات بقيمة{" "}
                {(freeShippingThreshold - cartTotal).toFixed(2)} ر.س للحصول على
                شحن مجاني
              </div>
            )}

            <div className="flex justify-between border-t pt-4 text-xl font-bold text-gray-800">
              <span>الإجمالي</span>
              <span>{finalTotal.toFixed(2)} ر.س</span>
            </div>

            <Link
              to="/cart"
              className="mt-6 block text-center text-sm text-gray-500 transition hover:text-green-600"
            >
              ← تعديل السلة
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
