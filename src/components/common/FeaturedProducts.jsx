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

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    toggleWishlist(productId);
  };

  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            المنتجات المميزة 🌿
          </h2>

          <p className="mt-3 text-gray-500">
            منتجات مختارة بعناية لأفضل تجربة صحية
          </p>
        </div>

        {featured.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات بعد.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* مفضلة */}
                <button
                  onClick={(e) => handleToggleWishlist(e, product.id)}
                  className={`absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110 ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <FaHeart />
                </button>

                {/* خصم */}
                {product.oldPrice && (
                  <div className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                    خصم
                  </div>
                )}

                {/* صورة */}
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-110 md:h-72"
                  />
                </div>

                {/* البيانات */}
                <div className="space-y-4 p-5">
                  {/* التصنيف */}
                  {product.category && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {product.category}
                    </span>
                  )}

                  {/* الاسم */}
                  <h3 className="line-clamp-2 min-h-[55px] text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>

                  {/* التقييم */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>

                    <span className="text-sm text-gray-500">(4.9)</span>
                  </div>

                  {/* السعر */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price} ر.س
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.oldPrice} ر.س
                      </span>
                    )}
                  </div>

                  {/* المخزون */}
                  <div>
                    {product.stock > 0 ? (
                      <span className="text-sm font-semibold text-green-600">
                        متوفر بالمخزون
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-red-500">
                        نفد المخزون
                      </span>
                    )}
                  </div>

                  {/* زر السلة */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock <= 0}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition ${
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
