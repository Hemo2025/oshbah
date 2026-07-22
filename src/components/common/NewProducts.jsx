import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";

function NewProducts() {
  const { products } = useStore();

  const latestProducts = [...products].reverse().slice(0, 4);

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-green-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 md:text-4xl">
          ✨ أحدث المنتجات
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {latestProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.seoSlug || product.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* صورة المنتج */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/500"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* معلومات المنتج */}
              <div className="p-3 md:p-5">
                <p className="mb-1 text-xs text-gray-500 md:text-sm">
                  {product.category}
                </p>

                <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-gray-800 md:text-lg">
                  {product.name}
                </h3>

                <p className="mt-3 text-base font-bold text-green-600 md:mt-4 md:text-2xl">
                  {product.price} ر.س
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewProducts;
