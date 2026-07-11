import { useState } from "react";

function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || "");

  return (
    <div>
      <img
        src={selectedImage}
        alt={product.name}
        loading="lazy"
        className="mb-4 h-[500px] w-full rounded-3xl object-cover shadow-lg"
      />

      <div className="flex flex-wrap gap-3">
        {product.images?.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name}-${index}`}
            loading="lazy"
            onClick={() => setSelectedImage(image)}
            className={`h-24 w-24 cursor-pointer rounded-xl border-2 object-cover transition ${
              selectedImage === image
                ? "border-green-600"
                : "border-gray-200 hover:border-green-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
