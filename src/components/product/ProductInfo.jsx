import { FaStar, FaCheckCircle } from "react-icons/fa";

function ProductInfo({ product }) {
  const discount =
    product.oldPrice && product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  return (
    <div>
      {/* Category */}
      <div className="mb-5 flex items-center gap-3">
        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          🌿 {product.category}
        </span>

        {discount > 0 && (
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-600">
            خصم {discount}%
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold leading-relaxed text-gray-800 lg:text-5xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-yellow-50 px-4 py-2">
          <FaStar className="text-yellow-400" />

          <span className="font-bold">{product.rating || 5}</span>
        </div>

        <span className="text-gray-500">({product.reviews || 0} تقييم)</span>
      </div>

      {/* Price */}
      <div className="mt-8 rounded-3xl bg-green-50 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-4xl font-bold text-green-600">
            {product.price} ر.س
          </span>

          {product.oldPrice > 0 && (
            <span className="text-2xl text-gray-400 line-through">
              {product.oldPrice} ر.س
            </span>
          )}
        </div>

        {discount > 0 && (
          <p className="mt-3 font-semibold text-red-500">
            وفر {product.oldPrice - product.price} ر.س
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="mt-8">
        {product.stock > 0 ? (
          <div className="inline-flex items-center gap-3 rounded-2xl bg-green-100 px-5 py-3 text-green-700">
            <FaCheckCircle />

            <span className="font-bold">متوفر بالمخزون</span>

            <span className="rounded-full bg-white px-3 py-1 text-sm">
              {product.stock} قطعة
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-600">
            غير متوفر حالياً
          </div>
        )}
      </div>

      {/* Features */}

      {/* Description */}
      {product.description && (
        <div className="mt-10 border-t pt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-800">وصف المنتج</h3>

          <p className="leading-9 text-gray-600">{product.description}</p>
        </div>
      )}
    </div>
  );
}

export default ProductInfo;
