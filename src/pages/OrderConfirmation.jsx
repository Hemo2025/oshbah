import { useEffect, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useOrders } from "../hooks/useOrders";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const location = useLocation();
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
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <FaCheckCircle className="mx-auto mb-6 text-6xl text-green-600" />

          <h1 className="text-3xl font-bold text-gray-800">
            شكراً لك، تم استلام طلبك!
          </h1>

          <p className="mt-3 text-gray-500">رقم طلبك هو</p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {order.orderNumber}
          </p>

          <p className="mt-4 text-sm text-gray-500">
            راح نتواصل معك على رقم {order.customer.phone} لتأكيد التوصيل.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-6 text-right">
            <h2 className="mb-4 font-bold text-gray-800">تفاصيل الطلب</h2>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b py-2 text-sm last:border-b-0"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)} ر.س
                </span>
              </div>
            ))}

            <div className="mt-3 flex justify-between font-bold text-gray-800">
              <span>الإجمالي</span>
              <span>{order.total.toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/products"
              className="rounded-xl bg-green-600 px-8 py-3 text-white transition hover:bg-green-700"
            >
              متابعة التسوق
            </Link>

            <Link
              to="/track-order"
              className="rounded-xl border border-green-600 px-8 py-3 text-green-700 transition hover:bg-green-50"
            >
              متابعة حالة الطلب
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
