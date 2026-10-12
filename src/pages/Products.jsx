import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaStar,
  FaShoppingCart,
  FaSearch,
  FaCheck,
  FaHeart,
  FaTimes,
  FaArrowLeft,
  FaLeaf,
  FaThLarge,
} from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export default function Products() {
  const productsSectionRef = useRef(null);
  const { products = [], categories = [] } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [addedId, setAddedId] = useState(null);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFloatingSearch] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const section = productsSectionRef.current;

      if (!section) {
        setShowStickySearch(false);
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;

      setShowStickySearch(sectionTop <= 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchContainerRef = useRef(null);
  const stickySearchContainerRef = useRef(null);
  const activeCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const formatPrice = (value) =>
    new Intl.NumberFormat("ar-SA", {
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);

  const searchSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return products
      .filter((product) => {
        const productCategories = Array.isArray(product.categories)
          ? product.categories
          : product.category
            ? [product.category]
            : [];

        const haystack = [
          product.name,
          ...productCategories,
          product.description,
          ...(Array.isArray(product.ingredients) ? product.ingredients : []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .slice(0, 6);
  }, [products, search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedInsideOriginal = searchContainerRef.current?.contains(
        event.target,
      );

      const clickedInsideSticky = stickySearchContainerRef.current?.contains(
        event.target,
      );

      if (!clickedInsideOriginal && !clickedInsideSticky) {
        setShowSearchResults(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateParams = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      return next;
    });
  };

  const handleSearchChange = (value) => {
    updateParams("search", value);
  };

  const handleCategoryClick = (categoryName) => {
    const nextCategory = categoryName === activeCategory ? "" : categoryName;

    updateParams("category", nextCategory);

    requestAnimationFrame(() => {
      productsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const getProductCategories = (product) =>
    Array.isArray(product.categories)
      ? product.categories
      : product.category
        ? [product.category]
        : [];

  const getCategoryImage = (category) => {
    const savedImage =
      category.image ||
      category.imageUrl ||
      category.imageURL ||
      category.photo ||
      category.thumbnail;

    if (savedImage) return savedImage;

    const relatedProduct = products.find((product) => {
      const names = getProductCategories(product);
      return names.includes(category.name) && product.images?.[0];
    });

    return relatedProduct?.images?.[0] || "";
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const productCategories = Array.isArray(product.categories)
          ? product.categories
          : product.category
            ? [product.category]
            : [];

        const matchesCategory = activeCategory
          ? productCategories.includes(activeCategory)
          : true;

        if (!matchesCategory) return false;
        if (!query) return true;

        const haystack = [
          product.name,
          ...productCategories,
          product.description,
          ...(Array.isArray(product.ingredients) ? product.ingredients : []),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort(
        (a, b) => Number(b.isPinned === true) - Number(a.isPinned === true),
      );
  }, [products, activeCategory, search]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      Number(product.stock) <= 0 &&
      product.stock !== undefined &&
      product.stock !== null
    ) {
      return;
    }

    addToCart(product, 1);
    setAddedId(product.id);

    setTimeout(() => {
      setAddedId((current) => (current === product.id ? null : current));
    }, 1500);
  };

  const handleToggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const getDiscount = (product) => {
    const price = Number(product.price) || 0;
    const oldPrice = Number(product.oldPrice) || 0;

    if (oldPrice <= price || oldPrice <= 0) return 0;

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const getProductImage = (product) =>
    product.images?.[0] ||
    "https://placehold.co/600x600/F3F5EF/66735B?text=Product";

  return (
    <main dir="rtl" className="min-h-screen bg-[#F8F9F5] pb-16 text-gray-900">
      {/* عنوان الصفحة */}
      <section className="border-b border-[#E8EDE3] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:py-14">
          {/* البحث */}

          <div
            ref={searchContainerRef}
            className="relative z-30 mt-7 max-w-2xl"
          >
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={search}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="ابحث عن منتج أو مكوّن..."
                aria-label="البحث عن المنتجات"
                aria-expanded={showSearchResults && Boolean(search.trim())}
                className="h-14 w-full rounded-2xl border border-gray-200 bg-[#FAFBF8] py-3 pr-12 pl-12 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-800/5"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearchChange("");
                    setShowSearchResults(false);
                  }}
                  aria-label="مسح البحث"
                  className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {showSearchResults && search.trim() && (
              <div className="absolute right-0 top-full mt-2 max-h-[420px] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                {searchSuggestions.length > 0 ? (
                  <>
                    <p className="px-3 py-2 text-xs font-bold text-gray-500">
                      نتائج البحث ({searchSuggestions.length}
                      {products.filter((product) => {
                        const categories = Array.isArray(product.categories)
                          ? product.categories
                          : product.category
                            ? [product.category]
                            : [];

                        return [
                          product.name,
                          ...categories,
                          product.description,
                          ...(Array.isArray(product.ingredients)
                            ? product.ingredients
                            : []),
                        ]
                          .join(" ")
                          .toLowerCase()
                          .includes(search.trim().toLowerCase());
                      }).length > 6
                        ? "+"
                        : ""}
                      )
                    </p>

                    {searchSuggestions.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${
                          product.seoSlug || product.slug || product.id
                        }`}
                        onClick={() => setShowSearchResults(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-green-50"
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            "https://placehold.co/100x100/F3F5EF/66735B?text=Product"
                          }
                          alt={product.name}
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-xl bg-[#F2F4EE] object-contain p-1"
                        />

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-bold leading-6 text-gray-800">
                            {product.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-black text-green-800">
                              {formatPrice(product.price)} ر.س
                            </span>

                            {Number(product.oldPrice) >
                              Number(product.price) && (
                              <span className="text-xs text-red-500 line-through">
                                {formatPrice(product.oldPrice)} ر.س
                              </span>
                            )}
                          </div>
                        </div>

                        <FaArrowLeft className="ml-1 shrink-0 text-xs text-green-700" />
                      </Link>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowSearchResults(false)}
                      className="mt-2 w-full rounded-xl bg-green-800 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-900"
                    >
                      عرض النتائج في الصفحة
                    </button>
                  </>
                ) : (
                  <p className="px-4 py-8 text-center text-sm text-gray-500">
                    لا توجد منتجات تطابق بحثك.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {showStickySearch && (
          <div
            className="fixed left-0 right-0 z-[99999] border-b border-gray-200 bg-white/95 px-4 py-3 shadow-md backdrop-blur-xl"
            style={{ top: "100px" }}
          >
            <div className="mx-auto max-w-7xl">
              <div
                ref={stickySearchContainerRef}
                className="relative mx-auto max-w-2xl"
              >
                <div className="relative">
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="search"
                    value={search}
                    onFocus={() => setShowSearchResults(true)}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                      setShowSearchResults(true);
                    }}
                    placeholder="ابحث عن منتج أو مكوّن..."
                    aria-label="البحث عن المنتجات"
                    aria-expanded={showSearchResults && Boolean(search.trim())}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-[#FAFBF8] py-3 pr-12 pl-12 text-sm outline-none transition focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-800/5"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSearchChange("");
                        setShowSearchResults(false);
                      }}
                      aria-label="مسح البحث"
                      className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {showSearchResults && search.trim() && (
                  <div className="absolute right-0 top-full mt-2 max-h-[420px] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                    {searchSuggestions.length > 0 ? (
                      <>
                        <p className="px-3 py-2 text-xs font-bold text-gray-500">
                          نتائج البحث ({searchSuggestions.length}
                          {searchSuggestions.length === 6 ? "+" : ""})
                        </p>

                        {searchSuggestions.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${
                              product.seoSlug || product.slug || product.id
                            }`}
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-green-50"
                          >
                            <img
                              src={
                                product.images?.[0] ||
                                "https://placehold.co/100x100/F3F5EF/66735B?text=Product"
                              }
                              alt={product.name}
                              loading="lazy"
                              className="h-16 w-16 shrink-0 rounded-xl bg-[#F2F4EE] object-contain p-1"
                            />

                            <div className="min-w-0 flex-1">
                              <h3 className="line-clamp-2 text-sm font-bold leading-6 text-gray-800">
                                {product.name}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <span className="text-sm font-black text-green-800">
                                  {formatPrice(product.price)} ر.س
                                </span>

                                {Number(product.oldPrice) >
                                  Number(product.price) && (
                                  <span className="text-xs text-red-500 line-through">
                                    {formatPrice(product.oldPrice)} ر.س
                                  </span>
                                )}
                              </div>
                            </div>

                            <FaArrowLeft className="ml-1 shrink-0 text-xs text-green-700" />
                          </Link>
                        ))}

                        <button
                          type="button"
                          onClick={() => setShowSearchResults(false)}
                          className="mt-2 w-full rounded-xl bg-green-800 px-3 py-3 text-sm font-bold text-white transition hover:bg-green-900"
                        >
                          عرض النتائج في الصفحة
                        </button>
                      </>
                    ) : (
                      <p className="px-4 py-8 text-center text-sm text-gray-500">
                        لا توجد منتجات تطابق بحثك.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* التصنيفات المصورة */}
        {categories.length > 0 && (
          <section className="pt-9 sm:pt-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-bold text-green-800">
                  تسوّق حسب احتياجك
                </p>

                <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                  تصفّح التصنيفات
                </h2>
              </div>

              {activeCategory && (
                <button
                  type="button"
                  onClick={() => handleCategoryClick(activeCategory)}
                  className="shrink-0 text-xs font-bold text-green-800 hover:text-green-950 sm:text-sm"
                >
                  عرض الكل
                </button>
              )}
            </div>

            <div className="grid grid-flow-col auto-cols-[calc((100%-1rem)/3)] gap-2 overflow-x-auto overscroll-x-contain pb-3 scroll-smooth snap-x snap-mandatory sm:auto-cols-[calc((100%-2rem)/3)] sm:gap-3">
              <button
                type="button"
                onClick={() => handleCategoryClick("")}
                aria-pressed={!activeCategory}
                className={`group min-w-0 snap-start overflow-hidden rounded-xl border text-right transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  !activeCategory
                    ? "border-green-800 bg-green-50 ring-1 ring-green-800"
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-[#E9EFE3]">
                  <div className="flex h-full items-center justify-center">
                    <FaThLarge className="text-4xl text-green-800/70 transition duration-300 group-hover:scale-110" />
                  </div>
                </div>

                <div className="flex min-h-[42px] items-center justify-between gap-1 px-2 py-2">
                  <span className="text-sm font-extrabold text-gray-900">
                    جميع المنتجات
                  </span>
                  <FaArrowLeft className="shrink-0 text-xs text-green-800" />
                </div>
              </button>

              {categories.map((category) => {
                const image = getCategoryImage(category);
                const isActive = activeCategory === category.name;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category.name)}
                    aria-pressed={isActive}
                    className={`group min-w-0 snap-start overflow-hidden rounded-xl border text-right transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isActive
                        ? "border-green-800 bg-green-50 ring-1 ring-green-800"
                        : "border-gray-100 bg-white hover:border-green-200"
                    }`}
                  >
                    <div className="relative aspect-[5/3] overflow-hidden bg-[#EDF0E8]">
                      {image ? (
                        <img
                          src={image}
                          alt={category.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FaLeaf className="text-4xl text-green-800/50 transition duration-300 group-hover:scale-110" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />

                      {isActive && (
                        <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-800 text-xs text-white shadow">
                          <FaCheck />
                        </span>
                      )}
                    </div>

                    <div className="flex min-h-[42px] items-center justify-between gap-1 px-2 py-2">
                      <span className="line-clamp-2 text-xs font-extrabold leading-5 text-gray-900">
                        {category.name}
                      </span>
                      <FaArrowLeft className="shrink-0 text-xs text-green-800 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* عنوان المنتجات والفلاتر */}
        <section ref={productsSectionRef} className="pt-10 sm:pt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <p className="mb-1 text-xs font-bold text-green-800">
                {activeCategory ? "تصفّح التصنيف المختار" : "اختيارات عُشبة"}
              </p>

              <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
                {activeCategory || "جميع المنتجات"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredProducts.length} منتج
                {search ? " مطابق للبحث" : " متاح للتصفح"}
              </p>
            </div>

            {(search || activeCategory) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:border-green-700 hover:text-green-800 sm:text-sm"
              >
                <FaTimes />
                مسح الفلاتر
              </button>
            )}
          </div>

          {/* بطاقات المنتجات */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center sm:py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <FaSearch className="text-xl text-green-800" />
              </div>

              <h3 className="text-lg font-extrabold text-gray-900">
                لم نعثر على منتجات
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                جرّب تغيير كلمات البحث أو اختر تصنيفًا آخر.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-900"
              >
                عرض جميع المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-4 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const discount = getDiscount(product);
                const inWishlist = isInWishlist(product.id);
                const added = addedId === product.id;
                const outOfStock =
                  product.stock !== undefined &&
                  product.stock !== null &&
                  Number(product.stock) <= 0;

                const productCategories = getProductCategories(product);
                const productUrl = `/product/${
                  product.seoSlug || product.slug || product.id
                }`;

                return (
                  <article
                    key={product.id}
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E9ECE4] bg-white transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5 sm:rounded-3xl"
                  >
                    <div className="relative">
                      <Link
                        to={productUrl}
                        aria-label={`عرض ${product.name}`}
                        className="block overflow-hidden bg-white"
                      >
                        <div className="relative aspect-square overflow-hidden bg-white">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-4"
                          />

                          {product.promoTitle?.trim() && (
                            <span className="absolute right-2 top-2 z-10 max-w-[75%] rounded-lg bg-green-800 px-3 py-1.5 text-[10px] font-extrabold leading-5 text-white shadow-md sm:right-3 sm:top-3 sm:px-3.5 sm:text-xs">
                              {product.promoTitle.trim()}
                            </span>
                          )}
                        </div>
                      </Link>

                      {discount > 0 && (
                        <span className="absolute right-2 top-2 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm sm:right-3 sm:top-3 sm:text-xs">
                          خصم {discount}%
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleToggleWishlist(e, product.id)}
                        aria-label={
                          inWishlist ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                        }
                        aria-pressed={inWishlist}
                        className={`absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-sm transition hover:scale-105 sm:left-3 sm:top-3 sm:h-10 sm:w-10 ${
                          inWishlist
                            ? "text-red-600"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <FaHeart />
                      </button>

                      {outOfStock && (
                        <div className="absolute inset-x-0 bottom-0 bg-gray-900/75 px-2 py-2 text-center text-xs font-bold text-white">
                          غير متوفر حاليًا
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      {productCategories.length > 0 && (
                        <p className="mb-2 line-clamp-1 text-[10px] font-bold text-green-800 sm:text-xs">
                          {productCategories.join(" • ")}
                        </p>
                      )}

                      <Link to={productUrl} className="mb-2 block">
                        <h3 className="line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-gray-900 transition-colors group-hover:text-green-800 sm:min-h-[48px] sm:text-base sm:leading-6">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-3 flex items-center gap-1 text-[10px] text-amber-400 sm:text-xs">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar key={index} />
                        ))}
                        <span className="mr-1 text-[10px] font-medium text-gray-400 sm:text-xs">
                          تقييمات
                        </span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-base font-black text-green-800 sm:text-xl">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-[10px] font-bold text-green-800 sm:text-xs">
                            ر.س
                          </span>

                          {discount > 0 && (
                            <span className="text-[10px] font-bold text-red-500 line-through sm:text-xs">
                              {formatPrice(product.oldPrice)} ر.س
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={outOfStock}
                          className={`mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-extrabold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 sm:mt-4 sm:min-h-11 sm:text-sm ${
                            added
                              ? "bg-green-900 text-white"
                              : "bg-green-800 text-white hover:bg-green-900"
                          }`}
                        >
                          {added ? (
                            <>
                              <FaCheck />
                              تمت الإضافة
                            </>
                          ) : outOfStock ? (
                            "غير متوفر"
                          ) : (
                            <>
                              <FaShoppingCart />
                              أضف للسلة
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
      {showFloatingSearch && (
        <button
          type="button"
          onClick={() => {
            searchContainerRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            setShowSearchResults(false);

            requestAnimationFrame(() => {
              searchContainerRef.current
                ?.querySelector('input[type="search"]')
                ?.focus({ preventScroll: true });
            });
          }}
          aria-label="البحث عن المنتجات"
          title="البحث عن المنتجات"
          className="fixed bottom-6 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-800 text-xl text-white shadow-xl shadow-green-900/25 transition hover:scale-105 hover:bg-green-900 active:scale-95 sm:bottom-8 sm:left-8"
        >
          <FaSearch />
        </button>
      )}
    </main>
  );
}
