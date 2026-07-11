import { Link, useParams } from "react-router-dom";
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
      <div className="flex min-h-[400px] items-center justify-center text-3xl font-bold">
        المنتج غير موجود
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (item) => item.id !== product.id && item.category === product.category,
    )
    .slice(0, 4);

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery key={product.id} product={product} />

          <div>
            <ProductInfo product={product} />
            <ProductActions product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
              🌿 قد يعجبك أيضًا
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  className="overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <img
                    src={
                      item.images?.[0] ||
                      "https://via.placeholder.com/500x500?text=No+Image"
                    }
                    alt={item.name}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-5">
                    <p className="mb-2 text-sm text-gray-500">
                      {item.category}
                    </p>

                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>

                    <div className="mt-4">
                      {item.oldPrice && (
                        <span className="mr-2 text-gray-400 line-through">
                          {item.oldPrice} ر.س
                        </span>
                      )}

                      <span className="text-xl font-bold text-green-600">
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
