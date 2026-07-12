import { Link, useParams } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import { useStore } from "../hooks/useStore";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";

function ProductDetails() {
  const { slug } = useParams();

  const { products, getProductBySlug } = useStore();

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-green-50">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h2 className="mb-4 text-3xl font-bold text-red-500">
            المنتج غير موجود
          </h2>

          <Link
            to="/shop"
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
                  to={`/product/${item.slug}`}
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
    </section>
  );
}

export default ProductDetails;
