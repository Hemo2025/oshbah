import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";

function NewProducts() {
  const { products } = useStore();

  const latestProducts = [...products].reverse().slice(0, 4);

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-green-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
          ✨ أحدث المنتجات
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {latestProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={product.images?.[0] || "https://via.placeholder.com/500"}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">
                <p className="text-sm text-gray-500">{product.category}</p>

                <h3 className="mt-2 text-lg font-bold text-gray-800">
                  {product.name}
                </h3>

                <p className="mt-4 text-2xl font-bold text-green-600">
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
