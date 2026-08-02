import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { useSettings } from "../hooks/useSettings";
export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const { settings } = useSettings();

  const shippingFee = settings?.shipping?.shippingFee || 0;

  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 0;

  const shippingCost =
    freeShippingThreshold > 0 && cartTotal >= freeShippingThreshold
      ? 0
      : shippingFee;

  const finalTotal = cartTotal + shippingCost;

  const shippingProgress =
    freeShippingThreshold > 0
      ? Math.min(100, (cartTotal / freeShippingThreshold) * 100)
      : 100;

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <section className="bg-green-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FaShoppingBag className="mx-auto mb-6 text-6xl text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-800">سلتك فارغة</h1>
          <p className="mt-3 text-gray-500">
            لم تقم بإضافة أي منتجات إلى السلة بعد.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block rounded-xl bg-green-600 px-8 py-3 text-white transition hover:bg-green-700"
          >
            تصفح المنتجات
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800">
          سلة المشتريات 🛒
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div
              className="overflow-hidden rounded-3xl hover:shadow-lg
transition-all
duration-300 bg-white shadow"
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
flex flex-col
gap-4
border-b
p-6

transition-all
duration-300

hover:bg-green-50

last:border-b-0

sm:flex-row
sm:items-center
"
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="mt-2 font-semibold text-green-600">
                      {item.price} ر.س
                    </p>
                  </div>

                  <div
                    className="flex items-center overflow-hidden rounded-2xl
border
border-green-100
shadow-sm hover:bg-green-50"
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      <FaMinus />
                    </button>

                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <p className="w-24 text-left font-bold text-gray-800">
                    {(item.price * item.quantity).toFixed(2)} ر.س
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-lg border border-red-200
bg-red-50
text-red-500 hover:bg-red-500
hover:text-white p-3 text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="sticky top-24 h-fit rounded-3xl border border-green-100 bg-white p-6 shadow-xl">
            {/* Order Status */}
            <div className="mb-6 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-xl">
                  📦
                </div>

                <div className="flex-1">
                  <p className="font-bold text-gray-800">طلبك جاهز للتأكيد</p>

                  <p className="text-sm text-gray-500">
                    سيتم تجهيز الطلب خلال 24 ساعة بعد تأكيده.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-3xl bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  💵
                </div>

                <div>
                  <p className="font-bold text-gray-800">الدفع عند الاستلام</p>

                  <p className="text-sm text-gray-500">
                    ادفع عند استلام طلبك بكل أمان
                  </p>
                </div>
              </div>
            </div>
            <h2 className="mb-6 text-xl font-bold text-gray-800">ملخص الطلب</h2>

            <div className="flex justify-between text-gray-600">
              <span>الإجمالي الفرعي</span>
              <span>{cartTotal.toFixed(2)} ر.س</span>
            </div>

            <div className="mt-2 flex justify-between text-gray-600">
              <span>الشحن</span>

              <span
                className={
                  shippingCost === 0
                    ? "font-semibold text-green-600"
                    : "font-semibold"
                }
              >
                {shippingCost === 0
                  ? "مجاني"
                  : `${shippingCost.toFixed(2)} ر.س`}
              </span>
            </div>

            {/* شريط التقدم */}
            {freeShippingThreshold > 0 && shippingCost > 0 && (
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-gray-500">
                  <span>التقدم نحو الشحن المجاني</span>

                  <span>{shippingProgress.toFixed(0)}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all duration-500"
                    style={{
                      width: `${shippingProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                  أضف منتجات بقيمة{" "}
                  {(freeShippingThreshold - cartTotal).toFixed(2)} ر.س للحصول
                  على شحن مجاني 🎁
                </div>
              </div>
            )}

            {shippingCost === 0 && freeShippingThreshold > 0 && (
              <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                🎉 مبروك! لقد حصلت على شحن مجاني.
              </div>
            )}

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold text-gray-800">
              <span>الإجمالي</span>
              <span>{finalTotal.toFixed(2)} ر.س</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="
    group
    relative
    mt-6
    flex
    h-14
    w-full
    items-center
    justify-center
    gap-2
    overflow-hidden
    rounded-xl

    bg-gradient-to-r
    from-green-600
    via-emerald-600
    to-green-700

    font-bold
    text-white

    shadow-lg

    transition-all
    duration-300

    hover:-translate-y-1
    hover:shadow-2xl
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
      bg-white/30
      blur-sm
      animate-[shine_3s_linear_infinite]
    "
              />
              ⚡ متابعة إتمام الطلب
            </button>

            <div className="mt-5 rounded-3xl border border-green-100 bg-green-50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  🚚 شحن سريع لجميع مناطق المملكة
                </div>

                <div className="flex items-center gap-2">
                  💵 الدفع عند الاستلام
                </div>

                <div className="flex items-center gap-2">
                  🔒 معلوماتك آمنة ومحمية
                </div>
              </div>
            </div>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-green-600"
            >
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
