import { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";

function ProductGallery({ product }) {
  const images = useMemo(() => {
    return product.images?.length
      ? product.images
      : ["https://via.placeholder.com/800x800?text=No+Image"];
  }, [product.images]);

  const [currentIndex, setCurrentIndex] = useState(() => 0);

  const [showPreview, setShowPreview] = useState(false);

  const selectedImage = images[currentIndex];

  // إعادة تعيين الصورة عند تغيير المنتج
  console.log(product.images);
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div>
        {/* Main Image */}
        <div
          className="
            group relative overflow-hidden
            rounded-[35px] bg-white shadow-2xl
          "
        >
          {/* Stock Badge */}
          {product.stock > 0 && (
            <div
              className="
                absolute left-5 top-5 z-20
                rounded-full bg-green-600
                px-4 py-2 text-sm
                font-bold text-white shadow-lg
              "
            >
              متوفر
            </div>
          )}

          {/* Zoom Button */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="
              absolute right-5 top-5 z-20
              rounded-2xl bg-white/90
              p-3 shadow-xl backdrop-blur
              transition duration-300
              hover:scale-110
            "
          >
            <FaExpand />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={prevImage}
              className="
                absolute left-5 top-1/2 z-20
                -translate-y-1/2
                rounded-full bg-white/90
                p-4 shadow-xl backdrop-blur
                transition duration-300
                hover:scale-110
                hover:bg-green-600
                hover:text-white
              "
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              className="
                absolute right-5 top-1/2 z-20
                -translate-y-1/2
                rounded-full bg-white/90
                p-4 shadow-xl backdrop-blur
                transition duration-300
                hover:scale-110
                hover:bg-green-600
                hover:text-white
              "
            >
              <FaChevronRight />
            </button>
          )}

          {/* Image */}
          <img
            src={selectedImage}
            alt={product.name}
            loading="lazy"
            onClick={() => setShowPreview(true)}
            className="
              h-[350px] w-full
              cursor-zoom-in object-cover
              transition duration-700
              group-hover:scale-110
              md:h-[550px]
            "
          />

          {/* Overlay */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-t
              from-black/10 to-transparent
            "
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`
                    overflow-hidden rounded-2xl
                    border-2 transition-all duration-300
                    ${
                      currentIndex === index
                        ? "scale-105 border-green-600 shadow-lg"
                        : "border-gray-200 hover:border-green-300"
                    }
                  `}
              >
                <img
                  src={image}
                  alt={`${product.name}-${index}`}
                  loading="lazy"
                  className="
                      h-24 w-24 object-cover
                      transition duration-300
                      hover:scale-110
                    "
                />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="mt-5 text-center text-sm text-gray-500">
            صورة{" "}
            <span className="font-bold text-green-600">{currentIndex + 1}</span>{" "}
            من {images.length}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          onClick={() => setShowPreview(false)}
          className="
            fixed inset-0 z-[999]
            flex items-center justify-center
            bg-black/90 p-5
          "
        >
          <button
            type="button"
            className="
              absolute right-8 top-8
              rounded-full bg-white p-4
              text-xl shadow-xl
            "
          >
            <FaTimes />
          </button>

          <img
            src={selectedImage}
            alt={product.name}
            className="
              max-h-[90vh]
              max-w-[90vw]
              rounded-3xl shadow-2xl
            "
          />
        </div>
      )}
    </>
  );
}

export default ProductGallery;
