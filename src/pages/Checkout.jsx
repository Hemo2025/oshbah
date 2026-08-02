import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import Select from "react-select";
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
import { trackTikTok } from "../lib/tiktokPixel";
const emptyCustomer = {
  name: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

const cityOptions = [
  { value: "الرياض", label: "الرياض (Riyadh)" },
  { value: "جدة", label: "جدة (Jeddah)" },
  { value: "مكة المكرمة", label: "مكة المكرمة (Makkah)" },
  { value: "المدينة المنورة", label: "المدينة المنورة (Madinah)" },
  { value: "الدمام", label: "الدمام (Dammam)" },
  { value: "الخبر", label: "الخبر (Khobar)" },
  { value: "الظهران", label: "الظهران (Dhahran)" },
  { value: "الجبيل", label: "الجبيل (Jubail)" },
  {
    value: "الجبيل الصناعية",
    label: "الجبيل الصناعية (Jubail Industrial City)",
  },
  { value: "الأحساء", label: "الأحساء (Al Ahsa)" },
  { value: "الهفوف", label: "الهفوف (Hofuf)" },
  { value: "المبرز", label: "المبرز (Al Mubarraz)" },
  { value: "القطيف", label: "القطيف (Qatif)" },
  { value: "رأس تنورة", label: "رأس تنورة (Ras Tanura)" },
  { value: "الخفجي", label: "الخفجي (Khafji)" },
  { value: "حفر الباطن", label: "حفر الباطن (Hafar Al-Batin)" },

  { value: "الطائف", label: "الطائف (Taif)" },
  { value: "رابغ", label: "رابغ (Rabigh)" },
  { value: "ينبع", label: "ينبع (Yanbu)" },
  { value: "ينبع الصناعية", label: "ينبع الصناعية (Yanbu Industrial City)" },
  { value: "خليص", label: "خليص (Khulais)" },
  { value: "بدر", label: "بدر (Badr)" },

  { value: "أبها", label: "أبها (Abha)" },
  { value: "خميس مشيط", label: "خميس مشيط (Khamis Mushait)" },
  { value: "أحد رفيدة", label: "أحد رفيدة (Ahad Rafidah)" },
  { value: "محايل عسير", label: "محايل عسير (Muhayil)" },
  { value: "بيشة", label: "بيشة (Bisha)" },
  { value: "النماص", label: "النماص (Al Namas)" },
  { value: "بلقرن", label: "بلقرن (Balqarn)" },

  { value: "جازان", label: "جازان (Jazan)" },
  { value: "صبيا", label: "صبيا (Sabya)" },
  { value: "أبو عريش", label: "أبو عريش (Abu Arish)" },
  { value: "صامطة", label: "صامطة (Samtah)" },
  { value: "الدرب", label: "الدرب (Al Darb)" },

  { value: "نجران", label: "نجران (Najran)" },
  { value: "شرورة", label: "شرورة (Sharurah)" },

  { value: "الباحة", label: "الباحة (Al Bahah)" },
  { value: "بلجرشي", label: "بلجرشي (Baljurashi)" },
  { value: "المخواة", label: "المخواة (Al Makhwah)" },

  { value: "تبوك", label: "تبوك (Tabuk)" },
  { value: "ضباء", label: "ضباء (Duba)" },
  { value: "الوجه", label: "الوجه (Al Wajh)" },
  { value: "أملج", label: "أملج (Umluj)" },

  { value: "حائل", label: "حائل (Hail)" },
  { value: "بقعاء", label: "بقعاء (Baqa)" },

  { value: "بريدة", label: "بريدة (Buraidah)" },
  { value: "عنيزة", label: "عنيزة (Unaizah)" },
  { value: "الرس", label: "الرس (Ar Rass)" },
  { value: "البكيرية", label: "البكيرية (Al Bukayriyah)" },

  { value: "عرعر", label: "عرعر (Arar)" },
  { value: "رفحاء", label: "رفحاء (Rafha)" },
  { value: "طريف", label: "طريف (Turaif)" },

  { value: "سكاكا", label: "سكاكا (Sakaka)" },
  { value: "دومة الجندل", label: "دومة الجندل (Dumat Al Jandal)" },
  { value: "القريات", label: "القريات (Al Qurayyat)" },

  { value: "وادي الدواسر", label: "وادي الدواسر (Wadi Al Dawasir)" },
  { value: "الخرج", label: "الخرج (Al Kharj)" },
  { value: "الدوادمي", label: "الدوادمي (Al Dawadmi)" },
  { value: "الزلفي", label: "الزلفي (Al Zulfi)" },
  { value: "المجمعة", label: "المجمعة (Al Majma'ah)" },
  { value: "شقراء", label: "شقراء (Shaqra)" },
  { value: "عفيف", label: "عفيف (Afif)" },
  { value: "القويعية", label: "القويعية (Al Quwayiyah)" },
  { value: "رماح", label: "رماح (Rumah)" },
  { value: "الدرعية", label: "الدرعية (Diriyah)" },

  { value: "أخرى", label: "أخرى (Other)" },
];
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
  const [orderCompleted, setOrderCompleted] = useState(false);

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
    trackTikTok("InitiateCheckout", {
      contents: cartItems.map((item) => ({
        content_id: item.id,
        content_name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      value: Number(finalTotal),
      currency: "SAR",
    });
  }, [cartItems, finalTotal]);
  if (cartItems.length === 0 && !orderCompleted) {
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
      trackTikTok("CompletePayment", {
        contents: order.items.map((item) => ({
          content_id: item.id,
          content_name: item.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        value: Number(order.total),
        currency: "SAR",
      });
      console.log("EMAIL RESPONSE:", data);

      const myOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

      if (!myOrders.includes(order.orderNumber)) {
        myOrders.push(order.orderNumber);

        localStorage.setItem("myOrders", JSON.stringify(myOrders));
      }
      setOrderCompleted(true);

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
              <div className="mb-8 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
                    🛡️
                  </div>

                  <div>
                    <p className="font-bold text-gray-800">
                      بياناتك محمية وآمنة
                    </p>

                    <p className="text-sm text-gray-500">
                      نستخدم بياناتك فقط لتوصيل الطلب والتواصل معك.
                    </p>
                  </div>
                </div>
              </div>
              بيانات الشحن
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* الاسم */}
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  الاسم الكامل *
                </label>

                <div className="relative">
                  <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500" />

                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="اسمك الكامل"
                    className="
w-full

rounded-xl

border-2
border-gray-100

bg-white

py-4
pr-12
pl-4

text-gray-800

shadow-sm

transition-all
duration-300

placeholder:text-green-500

focus:border-green-500
focus:shadow-lg
focus:shadow-green-100
focus:outline-none
"
                  />
                  {customer.name.trim() && (
                    <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
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
                  <FaPhone className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500" />

                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="
w-full

rounded-xl

border-2
border-gray-100

bg-white

py-4
pr-12
pl-4

text-gray-800

shadow-sm

transition-all
duration-300

placeholder:text-green-500

focus:border-green-500
focus:shadow-lg
focus:shadow-green-100
focus:outline-none
"
                  />
                  {customer.phone.length >= 10 && (
                    <FaCheckCircle className="absolute left-2 top-3 -translate-y-1/2 text-green-500" />
                  )}
                </div>

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* المدينة */}
              <div className="relative">
                <label className="mb-2 block font-semibold text-gray-700">
                  المدينة *
                </label>

                <Select
                  options={cityOptions}
                  isSearchable
                  placeholder="ابحث عن المدينة..."
                  noOptionsMessage={() => "لا توجد نتائج"}
                  value={
                    cityOptions.find((city) => city.value === customer.city) ||
                    null
                  }
                  onChange={(selected) =>
                    handleChange("city", selected?.value || "")
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: 56,
                      borderRadius: 16,
                      borderColor: state.isFocused ? "#16a34a" : "#e5e7eb",
                      boxShadow: state.isFocused
                        ? "0 0 0 4px rgba(34,197,94,.12)"
                        : "none",
                      "&:hover": {
                        borderColor: "#16a34a",
                      },
                    }),

                    menu: (base) => ({
                      ...base,
                      borderRadius: 16,
                      overflow: "hidden",
                      zIndex: 9999,
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#dcfce7" : "#fff",
                      color: "#111827",
                      cursor: "pointer",
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: "#9ca3af",
                    }),
                  }}
                />
                {customer.city && !errors.city && (
                  <FaCheckCircle className="absolute left-4 top-[58px] -translate-y-1/2 text-green-500" />
                )}
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
                  <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500" />

                  <input
                    type="text"
                    value={customer.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="الحي، الشارع، رقم المبنى"
                    className="
w-full

rounded-xl

border-2
border-gray-100

bg-white

py-4
pr-12
pl-4

text-gray-800

shadow-sm

transition-all
duration-300

placeholder:text-green-500

focus:border-green-500
focus:shadow-lg
focus:shadow-green-100
focus:outline-none
"
                  />
                  {customer.address.trim() && (
                    <FaCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
                  )}
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
                  <FaStickyNote className="absolute right-5 top-5 text-green-500" />

                  <textarea
                    rows={4}
                    value={customer.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="أي تعليمات إضافية للتوصيل"
                    className="
w-full

rounded-xl

border-2
border-gray-100

bg-white

py-4
pr-12
pl-4

text-gray-800

shadow-sm

transition-all
duration-300

placeholder:text-green-500

focus:border-green-500
focus:shadow-lg
focus:shadow-green-100
focus:outline-none
"
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
              className="
group
relative
overflow-hidden

mt-8

flex
h-14
w-full
items-center
justify-center
gap-2

rounded-xl

bg-gradient-to-r
from-green-600
via-emerald-600
to-green-700

font-bold
text-white

shadow-xl

transition-all
duration-300

hover:-translate-y-1
hover:shadow-2xl

active:scale-[0.98]

disabled:opacity-60
"
            >
              <span
                className="
absolute
-left-20
top-0
h-full
w-10
-skew-x-12
bg-white/25
blur-sm
animate-[shine_3s_linear_infinite]
"
              />
              ⚡{submitting ? "جارِ تأكيد الطلب..." : "تأكيد الطلب"}
            </button>
            <div className="mt-4 text-center text-sm text-gray-500">
              🚚 عادة يتم التواصل معك خلال أقل من ساعة لتأكيد الطلب.
            </div>
          </form>

          {/* ملخص الطلب */}
          <div className="sticky top-24 h-fit rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-xl">
                  🔒
                </div>

                <div>
                  <p className="font-bold text-gray-800">طلب آمن 100%</p>

                  <p className="text-sm text-gray-500">
                    لن تدفع أي مبلغ حتى تستلم طلبك.
                  </p>
                </div>
              </div>
            </div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              ملخص الطلب
            </h2>
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
              <span className="font-semibold">عدد المنتجات</span>

              <span className="rounded-full bg-green-600 px-3 py-1 text-white">
                {cartItems.reduce((s, item) => s + item.quantity, 0)}
              </span>
            </div>
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
