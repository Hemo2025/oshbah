import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaSearch,
  FaCheck,
  FaHeart,
  FaTimes,
} from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export default function Products() {
  const { products, categories } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedId, setAddedId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const handleSearchChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value.trim()) {
        next.set("search", value);
      } else {
        next.delete("search");
      }

      return next;
    });
  };

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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory
        ? product.category === activeCategory
        : true;

      if (!query) return matchesCategory;

      const haystack = [
        product.name,
        product.category,
        product.description,
        ...(product.ingredients || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && haystack.includes(query);
    });
  }, [products, activeCategory, search]);

  const handleCategoryClick = (categoryName) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (!categoryName || categoryName === activeCategory) {
        next.delete("category");
      } else {
        next.set("category", categoryName);
      }

      return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <section className="bg-green-50 py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-10 md:text-4xl">
          كل المنتجات 🌿
        </h1>

        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 md:mb-10">
          <div className="relative mx-auto w-full max-w-md">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-11 pl-10 text-sm outline-none transition focus:border-green-600"
            />

            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              <button
                onClick={() => handleCategoryClick("")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  !activeCategory
                    ? "bg-green-600 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                الكل
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === cat.name
                      ? "bg-green-600 text-white shadow"
                      : "bg-white text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {(search || activeCategory) && (
            <p className="text-center text-sm text-gray-500">
              {filteredProducts.length} نتيجة ·{" "}
              <button
                onClick={clearFilters}
                className="text-green-700 underline hover:text-green-800"
              >
                مسح الفلاتر
              </button>
            </p>
          )}
        </div>

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            لا توجد منتجات مطابقة لبحثك.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  onClick={(e) => handleToggleWishlist(e, product.id)}
                  className={`absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow transition hover:scale-110 md:left-3 md:top-3 md:h-10 md:w-10 ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <FaHeart size={14} />
                </button>

                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images?.[0] || "https://via.placeholder.com/500"
                    }
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 md:p-5">
                  <div className="mb-2 flex text-[10px] text-yellow-400 md:text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  <p className="mb-1 text-[11px] text-gray-500 md:text-sm">
                    {product.category}
                  </p>

                  <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 md:text-lg">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-base font-bold text-green-600 md:mt-3 md:text-2xl">
                    {product.price} ر.س
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm text-white transition md:mt-5 md:py-3 md:text-base ${
                      addedId === product.id
                        ? "bg-green-800"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {addedId === product.id ? (
                      <>
                        <FaCheck />
                        أضيف للسلة
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
