import { useState } from "react";
import { FaShoppingCart, FaCheck, FaMinus, FaPlus, FaHeart } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

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
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center overflow-hidden rounded-xl border">
        <button
          onClick={decrease}
          disabled={outOfStock}
          className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaMinus />
        </button>

        <span className="w-12 text-center font-semibold">{quantity}</span>

        <button
          onClick={increase}
          disabled={outOfStock}
          className="px-4 py-3 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPlus />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${
          added ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {added ? (
          <>
            <FaCheck /> أُضيف للسلة
          </>
        ) : (
          <>
            <FaShoppingCart /> أضف للسلة
          </>
        )}
      </button>

      <button
        onClick={() => toggleWishlist(product.id)}
        className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-semibold transition ${
          inWishlist
            ? "border-red-500 bg-red-50 text-red-500"
            : "border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500"
        }`}
      >
        <FaHeart />
        {inWishlist ? "بالمفضلة" : "أضف للمفضلة"}
      </button>
    </div>
  );
}

export default ProductActions;
