import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaCheck,
  FaMinus,
  FaPlus,
  FaHeart,
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

  const outOfStock = !product.stock || product.stock <= 0;

  const inWishlist = isInWishlist(product.id);

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const increase = () =>
    setQuantity((q) => Math.min(product.stock || 99, q + 1));

  const handleAddToCart = () => {
    if (outOfStock) return;

    addToCart(product, quantity);

    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: Number(product.price) * quantity,
      currency: "SAR",
    });

    window.dispatchEvent(
      new CustomEvent("cart-animation", {
        detail: {
          quantity,
        },
      }),
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };
  const handleBuyNow = () => {
    if (outOfStock) return;

    addToCart(product, quantity);

    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: Number(product.price) * quantity,
      currency: "SAR",
    });

    navigate("/checkout");
  };
  return (
    <div className="mt-10 rounded-3xl border border-green-100 bg-green-50 p-6">
      {/* Quantity */}
      <div className="mb-6">
        <p className="mb-3 font-bold text-gray-700">الكمية المطلوبة</p>

        <div className="flex w-fit items-center overflow-hidden rounded-2xl border bg-white shadow-sm">
          <button
            onClick={decrease}
            disabled={outOfStock}
            className="
              px-5 py-4 text-gray-600
              transition hover:bg-gray-100
              disabled:opacity-40
            "
          >
            <FaMinus />
          </button>

          <span className="min-w-[70px] text-center text-xl font-bold">
            {quantity}
          </span>

          <button
            onClick={increase}
            disabled={outOfStock}
            className="
              px-5 py-4 text-gray-600
              transition hover:bg-gray-100
              disabled:opacity-40
            "
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">
        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="
    group
    relative
    overflow-hidden
    flex
    h-14
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl

    bg-gradient-to-r
    from-emerald-600
    via-green-600
    to-emerald-700

    text-base
    font-bold
    text-white

    shadow-lg
    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-2xl

    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-60
  "
        >
          {/* Shine */}
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span
              className="
        absolute
        -left-20
        top-0
        h-full
        w-10
        -skew-x-12
        bg-white/25
        blur-[2px]
        animate-[shine_3s_linear_infinite]
      "
            />
          </span>

          <span className="relative text-xl">⚡</span>

          <span className="relative">اشترِ الآن</span>
        </button>

        <div className="flex gap-3">
          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`
group
flex
h-14
flex-1
items-center
justify-center
gap-2

rounded-xl

text-base
font-bold

shadow-md

transition-all
duration-300

active:scale-[0.98]

${
  added
    ? "bg-green-800 text-white"
    : "border border-green-600 bg-white text-green-700 hover:bg-green-50 hover:shadow-lg"
}
`}
          >
            {added ? (
              <>
                <FaCheck className="text-xl" />
                تمت الإضافة
              </>
            ) : (
              <>
                <FaShoppingCart className="text-xl transition-transform group-hover:scale-110" />
                أضف للسلة
              </>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`
flex
h-14
w-14
items-center
justify-center

rounded-xl

text-lg

transition-all
duration-300

active:scale-95

${
  inWishlist
    ? "bg-red-500 text-white shadow-lg"
    : "border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
}
`}
          >
            <FaHeart />
          </button>
        </div>
      </div>
      {/* Quick Buy */}
      {/* Purchase Benefits */}
      <div className="mt-5 rounded-3xl border border-green-200 bg-white p-4">
        <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <span>🚚</span>
            <span>شحن سريع لجميع مناطق المملكة</span>
          </div>

          <div className="flex items-center gap-2">
            <span>💵</span>
            <span>الدفع عند الاستلام</span>
          </div>

          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>طلبك ومعلوماتك محفوظة وآمنة</span>
          </div>

          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>دعم عبر واتساب عند الحاجة</span>
          </div>
        </div>
      </div>
      {/* Order Steps */}
      <div className="mt-5 rounded-2xl border border-dashed border-green-200 bg-green-50 p-5">
        <h3 className="mb-4 text-center font-bold text-gray-800">
          كيف تتم عملية الطلب؟
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white">
              🛒
            </div>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              اطلب الآن
            </p>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white">
              📦
            </div>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              تجهيز الطلب
            </p>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white">
              🚚
            </div>

            <p className="mt-2 text-xs font-semibold text-gray-700">الشحن</p>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-xl text-white">
              💵
            </div>

            <p className="mt-2 text-xs font-semibold text-gray-700">
              الدفع عند الاستلام
            </p>
          </div>
        </div>
      </div>
      {/* Stock Warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="mt-5 rounded-2xl bg-orange-100 p-4 text-center font-semibold text-orange-700">
          🔥 أسرع بالطلب، متبقي فقط {product.stock} قطع
        </div>
      )}

      {outOfStock && (
        <div className="mt-5 rounded-2xl bg-red-100 p-4 text-center font-semibold text-red-600">
          ❌ المنتج غير متوفر حالياً
        </div>
      )}
    </div>
  );
}

export default ProductActions;
