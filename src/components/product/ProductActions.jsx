import { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaCheck,
  FaMinus,
  FaPlus,
  FaHeart,
  FaTruck,
  FaMoneyBillWave,
} from "react-icons/fa";

import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { trackEvent } from "../../lib/metaPixel";

function ProductActions({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const stock = Math.max(0, Number(product.stock) || 0);
  const outOfStock = stock <= 0;
  const inWishlist = isInWishlist(product.id);

  const decrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increase = () => {
    setQuantity((current) => Math.min(stock, current + 1));
  };

  const trackAddToCart = () => {
    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: (Number(product.price) || 0) * quantity,
      currency: "SAR",
    });
  };

  const handleAddToCart = () => {
    if (outOfStock || quantity > stock) return;

    addToCart(product, quantity);
    trackAddToCart();

    window.dispatchEvent(
      new CustomEvent("cart-animation", {
        detail: { quantity },
      }),
    );

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (outOfStock || quantity > stock) return;

    addToCart(product, quantity);
    trackAddToCart();
    navigate("/checkout");
  };

  return (
    <div className="mt-7 w-full min-w-0 sm:mt-9">
      {/* الكمية */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">الكمية</h2>
          <p className="mt-1 text-xs text-gray-500">اختر العدد المطلوب</p>
        </div>

        <div className="flex h-12 items-center rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={decrease}
            disabled={outOfStock || quantity <= 1}
            aria-label="تقليل الكمية"
            className="flex h-full w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FaMinus className="text-xs" />
          </button>

          <span
            aria-live="polite"
            className="min-w-10 text-center text-base font-bold text-gray-900"
          >
            {quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={outOfStock || quantity >= stock}
            aria-label="زيادة الكمية"
            className="flex h-full w-11 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>

      {/* أزرار الشراء */}
      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-5 text-base font-bold text-white shadow-sm transition hover:bg-green-900 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
        >
          <span>اشترِ الآن</span>
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`flex h-13 min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${
              added
                ? "border-green-800 bg-green-800 text-white"
                : "border-green-800 bg-white text-green-800 hover:bg-green-50"
            }`}
          >
            {added ? (
              <>
                <FaCheck />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <FaShoppingCart />
                <span>أضف إلى السلة</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            aria-pressed={inWishlist}
            className={`flex h-[52px] w-[54px] shrink-0 items-center justify-center rounded-xl border transition active:scale-95 ${
              inWishlist
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:text-red-600"
            }`}
          >
            <FaHeart className="text-lg" />
          </button>
        </div>
      </div>

      {/* معلومات مختصرة */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-800">
              <FaTruck />
            </span>

            <div>
              <p className="text-sm font-bold text-gray-800">الشحن</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                لجميع مناطق المملكة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-800">
              <FaMoneyBillWave />
            </span>

            <div>
              <p className="text-sm font-bold text-gray-800">الدفع</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                عند الاستلام
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* تنبيه المخزون */}
      {!outOfStock && stock <= 5 && (
        <p className="mt-5 rounded-lg bg-orange-50 px-4 py-3 text-sm font-semibold leading-6 text-orange-800">
          الكمية المتبقية محدودة: {stock} قطع
        </p>
      )}

      {outOfStock && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          المنتج غير متوفر حاليًا
        </p>
      )}
    </div>
  );
}

export default ProductActions;
