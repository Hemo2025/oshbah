import { useState } from "react";
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
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Cart */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`
            flex flex-1 items-center justify-center gap-3
            rounded-2xl py-4 text-lg font-bold
            text-white shadow-lg transition-all duration-300
            disabled:cursor-not-allowed
            disabled:bg-gray-300

         ${
           added
             ? "bg-green-800 scale-105 animate-pulse"
             : "bg-green-600 hover:-translate-y-1 hover:bg-green-700"
         }
          `}
        >
          {added ? (
            <>
              <FaCheck />
              تمت الإضافة
            </>
          ) : (
            <>
              <FaShoppingCart />
              أضف إلى السلة
            </>
          )}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`
            flex items-center justify-center gap-3
            rounded-2xl px-6 py-4
            font-bold transition-all duration-300

            ${
              inWishlist
                ? "bg-red-500 text-white shadow-lg"
                : "border bg-white text-gray-600 hover:border-red-300 hover:text-red-500"
            }
          `}
        >
          <FaHeart />

          {inWishlist ? "في المفضلة" : "المفضلة"}
        </button>
      </div>

      {/* Quick Buy */}

      {/* Stock Warning */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="mt-5 rounded-2xl bg-orange-100 p-4 text-center font-semibold text-orange-700">
          ⚠️ متبقي فقط {product.stock} قطع
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
