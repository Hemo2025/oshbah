import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaStar, FaShoppingCart, FaSearch, FaCheck, FaHeart, FaTimes } from "react-icons/fa";
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
  const urlSearch = searchParams.get("search") || "";

  // Local input state, kept in sync with the URL so the header search
  // (or a shared link) can drive this page too.
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(urlSearch);
  }, [urlSearch]);

  // Debounce writing the search text back into the URL so we don't
  // spam history on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (search.trim()) {
          next.set("search", search.trim());
        } else {
          next.delete("search");
        }
        return next;
      });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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

      const matchesSearch = haystack.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  const handleCategoryClick = (categoryName) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (categoryName === activeCategory) {
        next.delete("category");
      } else {
        next.set("category", categoryName);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="mb-10 text-center text-4xl font-bold text-gray-800">
          كل المنتجات 🌿
        </h1>

        {/* Search + Filters */}
        <div className="mb-10 flex flex-col gap-4">
          <div className="relative mx-auto w-full max-w-md">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، التصنيف، أو الوصف..."
              className="w-full rounded-xl border py-3 pr-11 pl-10 outline-none focus:border-green-600"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="مسح البحث"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleCategoryClick("")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  !activeCategory
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-green-100"
                }`}
              >
                الكل
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                    activeCategory === cat.name
                      ? "bg-green-600 text-white"
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
              {filteredProducts.length} نتيجة
              {" "}
              <button
                onClick={clearFilters}
                className="text-green-700 underline hover:text-green-800"
              >
                مسح الفلاتر
              </button>
            </p>
          )}
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <p className="py-20 text-center text-gray-500">
            لا توجد منتجات مطابقة لبحثك.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
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
                  src={product.images?.[0]}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <div className="mb-3 flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  <p className="mb-1 text-sm text-gray-500">
                    {product.category}
                  </p>

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
