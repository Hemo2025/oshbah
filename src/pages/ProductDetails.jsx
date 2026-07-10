import { useParams } from "react-router-dom";
import { useStore } from "../hooks/useStore";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductActions from "../components/product/ProductActions";

function ProductDetails() {
  const { slug } = useParams();
  const { getProductBySlug } = useStore();

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-3xl font-bold">
        المنتج غير موجود
      </div>
    );
  }

  return (
    <section className="bg-green-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div>
            <ProductInfo product={product} />
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
