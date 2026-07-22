import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleRemove = (e, productId) => {
    e.preventDefault();
    removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="bg-green-50 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FaHeart className="mx-auto mb-6 text-6xl text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-800">
            قائمة المفضلة فارغة
          </h1>
          <p className="mt-3 text-gray-500">
            اضغط على أيقونة القلب بأي منتج عشان تضيفه هنا.
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
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800">
          المفضلة ❤️
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((product) => (
            <Link
              to={`/product/${product.seoSlug || product.slug}`}
              key={product.id}
              className="relative block overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <button
                onClick={(e) => handleRemove(e, product.id)}
                className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-500 shadow transition hover:scale-110"
                aria-label="إزالة من المفضلة"
              >
                <FaTrash />
              </button>

              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <p className="mb-1 text-sm text-gray-500">{product.category}</p>

                <h3 className="text-xl font-bold text-gray-800">
                  {product.name}
                </h3>

                <p className="mt-3 text-2xl font-bold text-green-600">
                  {product.price} ر.س
                </p>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-white transition ${
                    addedId === product.id
                      ? "bg-green-800"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {addedId === product.id ? (
                    <>
                      <FaCheck /> أُضيف للسلة
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> أضف للسلة
                    </>
                  )}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
