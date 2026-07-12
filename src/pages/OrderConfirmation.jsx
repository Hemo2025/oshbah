import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useOrders } from "../hooks/useOrders";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const myOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

  const hasAccess = location.state?.order || myOrders.includes(orderNumber);
  
  const { fetchOrderByNumber } = useOrders();

  // أسرع مسار: الطلب يوصلنا مباشرة من صفحة الدفع نفسها بدون أي
  // قراءة إضافية من Firestore.
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // لو الطلب موجود أصلاً (جاي من صفحة الدفع) ما نحتاج نجيبه من جديد
    if (order) return;

    let cancelled = false;

    fetchOrderByNumber(orderNumber).then((result) => {
      if (cancelled) return;

      if (result) {
        setOrder(result);
      } else {
        setNotFound(true);
      }

      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return (
      <section className="bg-green-50 py-20 text-center text-gray-500">
        جارٍ تحميل بيانات الطلب...
      </section>
    );
  }

  if (notFound || !order) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="bg-gradient-to-b from-green-50 via-white to-white py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* شريط التقدم */}
        <div className="mb-12 flex items-center justify-center gap-2 text-xs font-semibold md:text-sm">
          <div className="rounded-full bg-green-600 px-4 py-2 text-white">
            ✓ السلة
          </div>

          <div className="h-[2px] w-8 bg-green-500 md:w-12" />

          <div className="rounded-full bg-green-600 px-4 py-2 text-white">
            ✓ إتمام الطلب
          </div>

          <div className="h-[2px] w-8 bg-green-500 md:w-12" />

          <div className="rounded-full bg-green-600 px-4 py-2 text-white">
            ✓ تم الطلب
          </div>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-sm">
          {/* رأس الصفحة */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-12 text-center text-white">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl text-green-600">
                <FaCheckCircle />
              </div>
            </div>

            <h1 className="text-3xl font-bold md:text-4xl">
              تم استلام طلبك بنجاح 🎉
            </h1>

            <p className="mt-3 text-green-50">شكراً لتسوقك من متجر عُشبة</p>

            <div className="mt-6 inline-flex rounded-2xl bg-white/20 px-6 py-3 text-lg font-bold backdrop-blur">
              رقم الطلب: {order.orderNumber}
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-6 md:p-10">
            {/* بيانات العميل */}
            <div className="mb-8 rounded-3xl bg-gray-50 p-6">
              <h2 className="mb-5 text-xl font-bold text-gray-800">
                بيانات التوصيل
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">الاسم</p>

                  <p className="font-semibold text-gray-800">
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">رقم الجوال</p>

                  <p className="font-semibold text-gray-800">
                    {order.customer.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">المدينة</p>

                  <p className="font-semibold text-gray-800">
                    {order.customer.city}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">العنوان</p>

                  <p className="font-semibold text-gray-800">
                    {order.customer.address}
                  </p>
                </div>
              </div>

              {order.customer.notes && (
                <div className="mt-5 border-t pt-5">
                  <p className="text-sm text-gray-500">الملاحظات</p>

                  <p className="mt-1 text-gray-700">{order.customer.notes}</p>
                </div>
              )}
            </div>

            {/* تفاصيل المنتجات */}
            <div className="rounded-3xl bg-gray-50 p-6">
              <h2 className="mb-6 text-xl font-bold text-gray-800">
                تفاصيل الطلب
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        الكمية: {item.quantity}
                      </p>
                    </div>

                    <div className="font-bold text-green-700">
                      {(item.price * item.quantity).toFixed(2)} ر.س
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-5">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>الإجمالي</span>

                  <span className="text-green-700">
                    {order.total.toFixed(2)} ر.س
                  </span>
                </div>
              </div>
            </div>

            {/* رسالة */}
            <div className="mt-8 rounded-3xl bg-green-50 p-5 text-center text-green-700">
              سيتم التواصل معك قريباً لتأكيد الطلب وتنسيق عملية التوصيل.
            </div>

            {/* الأزرار */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/products"
                className="
                rounded-2xl
                bg-gradient-to-r
                from-green-600
                to-emerald-500
                px-8 py-4
                text-center
                font-bold
                text-white
                shadow-lg
                transition
                hover:-translate-y-1
              "
              >
                متابعة التسوق
              </Link>

              <Link
                to="/track-order"
                className="
                rounded-2xl
                border
                border-green-600
                px-8 py-4
                text-center
                font-bold
                text-green-700
                transition
                hover:bg-green-50
              "
              >
                متابعة حالة الطلب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
