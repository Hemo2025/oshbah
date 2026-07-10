import { useState } from "react";

function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div>
      <img
        src={selectedImage}
        alt={product.name}
        loading="lazy"
        className="mb-4 h-[500px] w-full rounded-3xl object-cover shadow-lg"
      />

      <div className="flex gap-3">
        {product.images.map((image, index) => (
          <img
            loading="lazy"
            key={index}
            src={image}
            alt={product.name}
            onClick={() => setSelectedImage(image)}
            className={`h-24 w-24 cursor-pointer rounded-xl border-2 object-cover ${
              selectedImage === image ? "border-green-600" : "border-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
