import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
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
            <div className="overflow-hidden rounded-2xl bg-white shadow">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 border-b p-6 last:border-b-0 sm:flex-row sm:items-center"
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

                  <div className="flex items-center overflow-hidden rounded-xl border">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      <FaMinus />
                    </button>

                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
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
                    className="rounded-lg bg-red-500 p-3 text-white transition hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              ملخص الطلب
            </h2>

            <div className="flex justify-between text-gray-600">
              <span>الإجمالي الفرعي</span>
              <span>{cartTotal.toFixed(2)} ر.س</span>
            </div>

            <div className="mt-2 flex justify-between text-gray-600">
              <span>الشحن</span>
              <span>مجاني</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold text-gray-800">
              <span>الإجمالي</span>
              <span>{cartTotal.toFixed(2)} ر.س</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700"
            >
              إتمام الشراء
            </button>

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
