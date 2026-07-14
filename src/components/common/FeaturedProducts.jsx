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

  const featured = products.slice(0, 8);

  const handleAddToCart = (e, product) => {
    e.preventDefault();

    addToCart(product, 1);

    setAddedId(product.id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    toggleWishlist(productId);
  };

  return (
    <section className="bg-green-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">
            المنتجات المميزة 🌿
          </h2>

          <p className="mt-3 text-sm text-gray-500 md:text-base">
            منتجات مختارة بعناية لأفضل تجربة صحية
          </p>
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات بعد.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* المفضلة */}
                <button
                  onClick={(e) => handleToggleWishlist(e, product.id)}
                  className={`absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 md:left-3 md:top-3 md:h-10 md:w-10 ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <FaHeart size={14} />
                </button>

                {/* الخصم */}
                {product.oldPrice && (
                  <div className="absolute right-2 top-2 z-20 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow md:right-3 md:top-3 md:px-3 md:text-xs">
                    خصم
                  </div>
                )}

                {/* الصورة */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images?.[0] || "https://via.placeholder.com/500"
                    }
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                {/* المعلومات */}
                <div className="space-y-2 p-3 md:space-y-4 md:p-5">
                  {product.category && (
                    <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700 md:px-3 md:text-xs">
                      {product.category}
                    </span>
                  )}

                  <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 md:min-h-[55px] md:text-lg">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="flex text-[10px] text-yellow-400 md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>

                    <span className="text-[10px] text-gray-500 md:text-sm">
                      (4.9)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-green-600 md:text-2xl">
                      {product.price} ر.س
                    </span>

                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through md:text-sm">
                        {product.oldPrice} ر.س
                      </span>
                    )}
                  </div>

                  <div>
                    {product.stock > 0 ? (
                      <span className="text-[11px] font-semibold text-green-600 md:text-sm">
                        متوفر بالمخزون
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-red-500 md:text-sm">
                        نفد المخزون
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock <= 0}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold text-white transition md:rounded-2xl md:py-3 md:text-base ${
                      product.stock <= 0
                        ? "cursor-not-allowed bg-gray-400"
                        : addedId === product.id
                          ? "bg-green-800"
                          : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <FaCheck />
                        تمت الإضافة
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        أضف للسلة
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
