function ProductInfo({ product }) {
  return (
    <div>
      <span className="rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
        {product.category}
      </span>

      <h1 className="mt-5 text-4xl font-bold">{product.name}</h1>

      <div className="mt-3 flex items-center gap-2">
        ⭐ {product.rating}
        <span className="text-gray-500">({product.reviews} تقييم)</span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-4xl font-bold text-green-600">
          {product.price} ر.س
        </span>

        <span className="text-xl text-gray-400 line-through">
          {product.oldPrice} ر.س
        </span>
        {product.oldPrice && product.price && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-600">
            %{" "}
            {Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100,
            )}
            خصم
          </span>
        )}
      </div>

      <div className="mt-6">
        {product.stock > 0 ? (
          <p className="text-green-600 font-semibold">
            ✅ متوفر بالمخزون ({product.stock})
          </p>
        ) : (
          <p className="text-red-600 font-semibold">❌ غير متوفر</p>
        )}
      </div>

      <p className="mt-8 leading-8 text-gray-600">{product.description}</p>
    </div>
  );
}

export default ProductInfo;
