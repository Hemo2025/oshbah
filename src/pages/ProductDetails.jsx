import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaTruck,
  FaShieldAlt,
  FaLeaf,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";

import { useStore } from "../hooks/useStore";
import { useCart } from "../hooks/useCart";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import ReviewForm from "../components/product/ReviewForm";
import ProductReviews from "../components/product/ProductReviews";

import { trackEvent } from "../lib/metaPixel";
import { trackTikTok } from "../lib/tiktokPixel";
import SEO from "../components/SEO/SEO";

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { products = [], getProductBySlug, isLoading } = useStore();
  const { addToCart } = useCart();

  const [showFloatingProduct, setShowFloatingProduct] = useState(false);

  const product = getProductBySlug(slug);

  // إظهار شريط الشراء عند النزول في الصفحة
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingProduct(window.scrollY > 500);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // تتبع مشاهدة المنتج
  useEffect(() => {
    if (!product) return;

    trackEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: Number(product.price),
      currency: "SAR",
    });

    trackTikTok("ViewContent", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      value: Number(product.price),
      currency: "SAR",
    });
  }, [product]);

  // تحويل الرابط إلى رابط SEO المعتمد
  useEffect(() => {
    if (
      product?.seoSlug &&
      slug === product.slug &&
      product.slug !== product.seoSlug
    ) {
      navigate(`/product/${product.seoSlug}`, { replace: true });
    }
  }, [product, slug, navigate]);

  const isStoreLoading = isLoading || (products.length === 0 && !product);

  // حالة التحميل
  if (isStoreLoading) {
    return (
      <section className="min-h-screen bg-[#F7F8F3] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-4 w-52 rounded-full bg-gray-200" />

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm lg:rounded-[32px]">
            <div className="grid lg:grid-cols-2">
              <div className="p-4 sm:p-8 lg:p-10">
                <div className="aspect-square rounded-2xl bg-gray-200 sm:rounded-3xl" />

                <div className="mt-4 flex gap-3">
                  <div className="h-16 w-16 rounded-xl bg-gray-200" />
                  <div className="h-16 w-16 rounded-xl bg-gray-200" />
                  <div className="h-16 w-16 rounded-xl bg-gray-200" />
                </div>
              </div>

              <div className="p-5 sm:p-8 lg:p-10">
                <div className="mb-5 h-5 w-28 rounded-full bg-gray-200" />
                <div className="mb-4 h-9 w-4/5 rounded-lg bg-gray-200" />
                <div className="mb-8 h-5 w-2/5 rounded-lg bg-gray-200" />

                <div className="mb-6 h-px bg-gray-100" />

                <div className="mb-4 h-20 rounded-2xl bg-gray-200" />
                <div className="mb-4 h-20 rounded-2xl bg-gray-200" />
                <div className="h-14 rounded-2xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // المنتج غير موجود
  if (!product) {
    return (
      <section
        dir="rtl"
        className="flex min-h-[65vh] items-center justify-center bg-[#F7F8F3] px-4 py-12"
      >
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
            <FaShoppingBag className="text-3xl" />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            المنتج غير موجود
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            ربما تم حذف المنتج أو تغيير رابطه. يمكنك العودة إلى المتجر وتصفح
            المنتجات المتاحة.
          </p>

          <Link
            to="/Products"
            className="mt-7 inline-flex items-center justify-center gap-3 rounded-xl bg-green-700 px-7 py-3.5 font-bold text-white transition hover:bg-green-800"
          >
            تصفح المنتجات
            <FaArrowLeft />
          </Link>
        </div>
      </section>
    );
  }

  const relatedProducts = products
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, 4);

  const productImage =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/160x160/F7F8F3/64748b?text=Product";

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("ar-SA", {
      maximumFractionDigits: 2,
    });

  const handleFloatingAddToCart = () => {
    addToCart(product);

    trackEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: Number(product.price),
      currency: "SAR",
    });

    trackTikTok("AddToCart", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      value: Number(product.price),
      currency: "SAR",
    });
  };

  return (
    <section
      dir="rtl"
      className="min-h-screen bg-[#F7F8F3] pb-12 pt-5 sm:pb-16 sm:pt-8 lg:pt-10"
    >
      <SEO product={product} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* مسار التنقل */}
        <nav
          aria-label="مسار التنقل"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:mb-8 sm:text-sm"
        >
          <Link to="/" className="transition hover:text-green-700">
            الرئيسية
          </Link>

          <FaChevronLeft className="text-[10px] text-gray-300" />

          <Link to="/Products" className="transition hover:text-green-700">
            المتجر
          </Link>

          <FaChevronLeft className="text-[10px] text-gray-300" />

          <span className="max-w-[180px] truncate font-semibold text-green-800 sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* البطاقة الرئيسية للمنتج */}
        <div className="overflow-hidden rounded-2xl border border-[#E8EDE4] bg-white shadow-[0_8px_40px_rgba(36,72,43,0.05)] sm:rounded-3xl lg:rounded-[32px]">
          <div className="grid min-w-0 lg:grid-cols-2">
            {/* صور المنتج */}
            <div className="min-w-0 border-b border-gray-100 bg-gradient-to-br from-[#F1F5EC] via-[#FAFBF8] to-white p-3 sm:p-6 lg:border-b-0 lg:border-l lg:p-8 xl:p-10">
              <div className="mx-auto max-w-xl">
                <ProductGallery key={product.id} product={product} />
              </div>
            </div>

            {/* تفاصيل المنتج والشراء */}
            <div className="min-w-0 p-4 sm:p-7 lg:p-8 xl:p-10">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-green-800 sm:text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                  <FaLeaf />
                </span>

                <span>اكتشف منتجات عُشبة</span>
              </div>

              <ProductInfo product={product} />

              <div className="my-6 h-px bg-gradient-to-l from-green-100 via-gray-100 to-transparent sm:my-8" />

              {/* مميزات المتجر */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4">
                <div className="rounded-2xl border border-green-100 bg-[#FAFCF8] p-3 text-center transition duration-300 hover:border-green-200 hover:shadow-sm sm:p-5">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl text-green-800 sm:h-12 sm:w-12">
                    <FaTruck />
                  </div>

                  <p className="mt-3 text-sm font-bold text-gray-800 sm:text-base">
                    خدمة التوصيل
                  </p>

                  <span className="mt-1 block text-[11px] leading-5 text-gray-500 sm:text-xs">
                    خيارات الشحن المتاحة عند الطلب
                  </span>
                </div>

                <div className="rounded-2xl border border-[#EDE5D3] bg-[#FCFAF5] p-3 text-center transition duration-300 hover:border-[#E1D4B7] hover:shadow-sm sm:p-5">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EBD5] text-xl text-[#886829] sm:h-12 sm:w-12">
                    <FaShieldAlt />
                  </div>

                  <p className="mt-3 text-sm font-bold text-gray-800 sm:text-base">
                    تجربة تسوق سهلة
                  </p>

                  <span className="mt-1 block text-[11px] leading-5 text-gray-500 sm:text-xs">
                    تصفح واطلب بكل سهولة
                  </span>
                </div>
              </div>

              {/* أزرار الشراء الأصلية */}
              <div className="rounded-2xl bg-[#FAFBF8] p-2 sm:p-3">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* تقييمات المنتج */}
        <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mt-14 sm:rounded-3xl sm:p-7 lg:p-9">
          <div className="mb-6">
            <span className="text-xs font-bold text-green-700 sm:text-sm">
              آراء العملاء
            </span>

            <h2 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
              تقييمات وتجارب العملاء
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              اطلع على التقييمات وشاركنا تجربتك مع هذا المنتج.
            </p>
          </div>

          <ProductReviews productId={product.id} />

          <div className="my-7 h-px bg-gray-100 sm:my-9" />

          <ReviewForm productId={product.id} />
        </section>

        {/* منتجات مشابهة */}
        {relatedProducts.length > 0 && (
          <section className="related-products mt-12 sm:mt-16 lg:mt-20">
            <div className="mb-6 flex items-end justify-between gap-3 sm:mb-9">
              <div>
                <span className="text-xs font-bold text-green-700 sm:text-sm">
                  اختر ما يناسبك
                </span>

                <h2 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-3xl">
                  منتجات مشابهة
                </h2>

                <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                  اكتشف المزيد من المنتجات من نفس الفئة.
                </p>
              </div>

              <Link
                to="/Products"
                className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-green-800 transition hover:bg-green-50 sm:text-sm"
              >
                عرض الكل
                <FaArrowLeft />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {relatedProducts.map((item) => {
                const image =
                  item.images?.[0] ||
                  item.image ||
                  "https://placehold.co/500x500/F7F8F3/64748b?text=Product";

                const hasOldPrice =
                  item.oldPrice !== undefined &&
                  item.oldPrice !== null &&
                  item.oldPrice !== "" &&
                  Number(item.oldPrice) > Number(item.price);

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.seoSlug || item.slug}`}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-100 hover:shadow-lg sm:rounded-3xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#F5F7F1]">
                      <img
                        src={image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105 sm:p-4"
                      />

                      {hasOldPrice && (
                        <span className="absolute right-2 top-2 rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 sm:right-3 sm:top-3 sm:text-xs">
                          <MdLocalOffer className="ml-1 inline-block" />
                          عرض خاص
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      {item.category && (
                        <span className="w-fit max-w-full truncate rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-800 sm:text-xs">
                          {item.category}
                        </span>
                      )}

                      <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-gray-800 transition group-hover:text-green-800 sm:min-h-12 sm:text-base sm:leading-6">
                        {item.name}
                      </h3>

                      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4 sm:gap-2">
                        <span className="text-base font-extrabold text-green-800 sm:text-xl">
                          {formatPrice(item.price)}{" "}
                          <span className="text-[10px] font-semibold sm:text-xs">
                            ر.س
                          </span>
                        </span>

                        {hasOldPrice && (
                          <span className="text-[11px] text-gray-400 line-through sm:text-sm">
                            {formatPrice(item.oldPrice)} ر.س
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-green-100 bg-[#FAFCF8] py-2.5 text-xs font-bold text-green-800 transition group-hover:border-green-700 group-hover:bg-green-700 group-hover:text-white sm:text-sm">
                        <FaShoppingBag />
                        عرض المنتج
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* شريط الشراء العائم */}
      {showFloatingProduct && (
        <div className="floating-cart fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:bottom-4 sm:left-1/2 sm:right-auto sm:w-[95%] sm:max-w-md sm:-translate-x-1/2 sm:px-0 sm:pb-0">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-[0_8px_35px_rgba(0,0,0,0.13)] backdrop-blur-md">
            <img
              src={productImage}
              alt={product.name}
              loading="lazy"
              className="h-12 w-12 shrink-0 rounded-xl bg-[#F5F7F1] object-contain p-1 sm:h-14 sm:w-14"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-xs font-bold text-gray-800 sm:text-sm">
                {product.name}
              </h3>

              <p className="mt-1 text-sm font-extrabold text-green-800 sm:text-base">
                {formatPrice(product.price)} ر.س
              </p>
            </div>

            <button
              type="button"
              onClick={handleFloatingAddToCart}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-3 py-3 text-xs font-bold text-white transition hover:bg-green-800 active:scale-[0.98] sm:px-5 sm:text-sm"
            >
              <FaShoppingBag />
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetails;
