import { Link, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { useStore } from "../hooks/useStore";
import { useEffect, useState } from "react";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";
import { useCart } from "../hooks/useCart";
import { Helmet } from "react-helmet-async";
import ReviewForm from "../components/product/ReviewForm";
import ProductReviews from "../components/product/ProductReviews";
function ProductDetails() {
  const { slug } = useParams();
  const [showFloatingProduct, setShowFloatingProduct] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingProduct(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // لو عندك isLoading/status جاهز في الـ store، استبدل بيه السطر ده
  const { products, getProductBySlug, isLoading } = useStore();
  const { addToCart } = useCart();
  const product = getProductBySlug(slug);
  const seoTitle = product?.seoTitle || `${product?.name} | عُشبة ستور`;

  const seoDescription =
    product?.seoDescription ||
    product?.description?.replace(/<[^>]*>/g, "").slice(0, 300) ||
    `اشتري ${product?.name} من متجر عُشبة`;

  const productSlug = product?.seoSlug || product?.slug;

  const productImage =
    product?.images?.[0] || "https://oshbahstore.com/logo.png";
  // حالة التحميل: لسه المنتجات ما وصلتش من الـ store
  const isStoreLoading = isLoading ?? products.length === 0;

  if (isStoreLoading) {
    return (
      <section className="bg-gradient-to-b from-green-50 via-white to-green-50 py-16">
        <div className="mx-auto max-w-7xl animate-pulse px-5">
          <div className="mb-8 h-4 w-48 rounded bg-gray-200" />

          <div className="overflow-hidden rounded-[35px] bg-white shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-green-50 to-white p-6 lg:p-10">
                <div className="aspect-square w-full rounded-3xl bg-gray-200" />
              </div>

              <div className="p-6 lg:p-10">
                <div className="mb-4 h-8 w-3/4 rounded bg-gray-200" />
                <div className="mb-8 h-6 w-1/3 rounded bg-gray-200" />

                <div className="my-8 h-px bg-gray-200" />

                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="h-28 rounded-2xl bg-gray-200" />
                  <div className="h-28 rounded-2xl bg-gray-200" />
                </div>

                <div className="h-14 w-full rounded-2xl bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-green-50">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h2 className="mb-4 text-3xl font-bold text-red-500">
            المنتج غير موجود
          </h2>

          <Link
            to="/"
            className="rounded-2xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, 4);

  return (
    <section className="bg-gradient-to-b from-green-50 via-white to-green-50 py-16">
      <Helmet>
        <title>{seoTitle}</title>

        <meta name="description" content={seoDescription} />

        <link
          rel="canonical"
          href={`https://oshbahstore.com/product/${productSlug}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />

        <meta property="og:description" content={seoDescription} />

        <meta property="og:image" content={productImage} />

        <meta
          property="og:url"
          content={`https://oshbahstore.com/product/${productSlug}`}
        />

        <meta property="og:type" content="product" />

        <meta property="og:site_name" content="عُشبة ستور" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content={seoTitle} />

        <meta name="twitter:description" content={seoDescription} />

        <meta name="twitter:image" content={productImage} />

        {/* Google Product Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",

            name: product.name,

            image: product.images?.length ? product.images : [productImage],

            description:
              product.description?.replace(/<[^>]*>/g, "") ||
              `اشتري ${product.name} من متجر عُشبة ستور`,

            sku: product.id,

            brand: {
              "@type": "Brand",
              name: "عُشبة ستور",
            },

            offers: {
              "@type": "Offer",
              url: `https://oshbahstore.com/product/${productSlug}`,
              priceCurrency: "SAR",
              price: String(product.price),

              availability:
                Number(product.stock) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",

              seller: {
                "@type": "Organization",
                name: "عُشبة ستور",
              },
            },
          })}
        </script>
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "الرئيسية",
                item: "https://oshbahstore.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "المنتجات",
                item: "https://oshbahstore.com/products",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.category || "منتجات طبيعية",
                item: `https://oshbahstore.com/products?category=${product.category}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: product.name,
                item: `https://oshbahstore.com/product/${productSlug}`,
              },
            ],
          })}
        </script>
      </Helmet>
      <div className="mx-auto max-w-7xl px-5">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">
            الرئيسية
          </Link>

          <FaChevronLeft className="text-xs" />

          <Link to="/" className="hover:text-green-600">
            المتجر
          </Link>

          <FaChevronLeft className="text-xs" />

          <span className="font-bold text-green-700">{product.name}</span>
        </div>

        {/* Main Product */}
        <div className="overflow-hidden rounded-[35px] bg-white shadow-2xl">
          <div className="grid lg:grid-cols-2">
            {/* Images */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 lg:p-10">
              <ProductGallery key={product.id} product={product} />
            </div>

            {/* Info */}
            <div className="p-6 lg:p-10">
              <ProductInfo product={product} />

              <div className="my-8 h-px bg-gray-200" />

              {/* Features */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-green-100 p-5 text-center transition hover:shadow-lg">
                  <div className="text-4xl">🚚</div>

                  <p className="mt-3 font-bold">شحن سريع</p>

                  <span className="text-sm text-gray-500">خلال 1-3 أيام</span>
                </div>

                <div className="rounded-2xl border border-green-100 p-5 text-center transition hover:shadow-lg">
                  <div className="text-4xl">🌿</div>

                  <p className="mt-3 font-bold">منتج طبيعي</p>

                  <span className="text-sm text-gray-500">جودة مضمونة</span>
                </div>
              </div>

              <ProductActions product={product} />
            </div>
          </div>
        </div>

        {/* Description */}

        <ProductReviews productId={product.id} />
        <ReviewForm productId={product.id} />
        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-10 text-center text-4xl font-bold text-gray-800">
              منتجات مشابهة
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.seoSlug || item.slug}`}
                  className="
                    group overflow-hidden rounded-[30px]
                    bg-white shadow-lg
                    transition-all duration-500
                    hover:-translate-y-3
                    hover:shadow-2xl
                  "
                >
                  <div className="overflow-hidden">
                    <img
                      src={
                        item.images?.[0] || "https://via.placeholder.com/500"
                      }
                      alt={item.name}
                      className="
                        h-64 w-full object-cover
                        transition duration-700
                        group-hover:scale-110
                      "
                    />
                  </div>

                  <div className="p-5">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      {item.category}
                    </span>

                    <h3 className="mt-4 line-clamp-2 text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>

                    <div className="mt-5 flex items-center gap-2">
                      {item.oldPrice && (
                        <span className="text-gray-400 line-through">
                          {item.oldPrice} ر.س
                        </span>
                      )}

                      <span className="text-2xl font-bold text-green-600">
                        {item.price} ر.س
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {showFloatingProduct && (
        <div
          className="
      fixed bottom-4 left-1/2 z-50
      w-[95%] max-w-md
      -translate-x-1/2
      rounded-2xl bg-white p-3
      shadow-2xl
      animate-[fadeIn_.3s]
    "
        >
          <div className="flex items-center gap-3">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1 overflow-hidden">
              <h3 className="truncate font-bold">{product.name}</h3>

              <p className="font-bold text-green-600">{product.price} ر.س</p>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="
    rounded-xl bg-green-600
    px-4 py-2 text-white
    hover:bg-green-700
  "
            >
              أضف للسلة
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetails;
