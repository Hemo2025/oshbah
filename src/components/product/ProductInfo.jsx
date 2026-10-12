import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useReviews } from "../../hooks/useReviews";
import { Link } from "react-router-dom";
function ProductInfo({ product }) {
  const { averageRating, reviews } = useReviews(product.id);

  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const stock = Number(product.stock) || 0;

  const hasDiscount = oldPrice > price && oldPrice > 0;
  const discount = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const formatPrice = (value) =>
    new Intl.NumberFormat("ar-SA", {
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="w-full min-w-0 text-right font-sans">
      {/* التصنيف */}

      {product.category && (
        <div className="mb-5 flex items-center gap-2.5">
          <span className="text-sm font-bold text-gray-500">التصنيف:</span>

          <Link
            to={`/categories/${encodeURIComponent(product.category)}`}
            className="inline-flex items-center rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-extrabold text-green-800 transition-all duration-200 hover:border-green-700 hover:bg-green-800 hover:text-white"
          >
            {product.category}
          </Link>
        </div>
      )}

      {/* اسم المنتج */}
      <h1 className="text-2xl font-extrabold leading-[1.8] tracking-tight text-gray-900 sm:text-3xl lg:text-[2.4rem]">
        {product.name}
      </h1>
      {/* التقييم */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          <FaStar className="text-amber-400" />
          <span className="font-bold text-gray-800">
            {reviews?.length > 0
              ? Number(averageRating || 0).toFixed(1)
              : "جديد"}
          </span>
        </div>

        <span className="text-gray-300">|</span>

        <span className="font-medium text-gray-500">
          {reviews?.length > 0
            ? `${reviews.length} تقييم`
            : "لا توجد تقييمات بعد"}
        </span>
      </div>
      <div className="my-6 h-px bg-gray-200 sm:my-7" />
      {/* السعر والخصم */}
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {/* السعر الحالي */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none tracking-tight text-green-700 sm:text-5xl">
              {formatPrice(price)}
            </span>

            <span className="text-base font-extrabold text-green-800 sm:text-lg">
              ر.س
            </span>
          </div>

          {/* السعر السابق */}
          {hasDiscount && (
            <span className="text-lg font-bold text-red-500 line-through decoration-2 sm:text-xl">
              {formatPrice(oldPrice)} ر.س
            </span>
          )}
        </div>

        {/* نسبة الخصم */}
        {hasDiscount && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm font-extrabold text-white">
              خصم {discount}%
            </span>

            <p className="text-sm font-bold text-red-600">
              وفّر {formatPrice(oldPrice - price)} ر.س
            </p>
          </div>
        )}
      </div>
      {/* حالة التوفر */}
      <div className="mt-6">
        {stock > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3.5 py-2.5">
            <FaCheckCircle className="shrink-0 text-green-700" />

            <span className="text-sm font-bold text-green-800">
              متوفر للطلب
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-lg bg-red-50 px-3.5 py-2.5">
            <span className="text-sm font-bold text-red-700">
              غير متوفر حاليًا
            </span>
          </div>
        )}
      </div>
      {/* وصف المنتج */}
      {product.description && (
        <div className="mt-8 border-t border-gray-200 pt-6 sm:mt-9 sm:pt-7">
          <h2 className="mb-3 text-lg font-extrabold text-gray-900 sm:text-xl">
            وصف المنتج
          </h2>

          <div
            className="product-description break-words text-[15px] font-medium leading-8 text-gray-700 sm:text-base sm:leading-9"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
