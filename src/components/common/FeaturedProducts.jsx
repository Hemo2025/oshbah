import { Link } from "react-router-dom";
import { useState } from "react";
import { FaStar, FaShoppingCart, FaCheck, FaHeart } from "react-icons/fa";
import { useStore } from "../../hooks/useStore";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";

function FeaturedProducts() {
  const { products } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedId, setAddedId] = useState(null);
  const featured = products.slice(0, 4);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    toggleWishlist(productId);
  };

  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
          المنتجات المميزة 🌿
        </h2>

        {featured.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات بعد.</p>
        ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link
              to={`/product/${product.slug}`}
              key={product.id}
              className="relative block overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <button
                onClick={(e) => handleToggleWishlist(e, product.id)}
                className={`absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
                  isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
                }`}
                aria-label="أضف للمفضلة"
              >
                <FaHeart />
              </button>

              <img
                src={product.images[0]}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <div className="mb-3 flex text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>

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
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
