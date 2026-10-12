import { useEffect, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";

function ProductGallery({ product }) {
  const images = useMemo(() => {
    const validImages = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

    return validImages.length
      ? validImages
      : ["https://placehold.co/800x800/F7F8F3/64748b?text=No+Image"];
  }, [product.images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const safeIndex = Math.min(currentIndex, images.length - 1);
  const selectedImage = images[safeIndex];
  const hasMultipleImages = images.length > 1;

  // إغلاق نافذة التكبير والتنقل باستخدام لوحة المفاتيح
  useEffect(() => {
    if (!showPreview) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowPreview(false);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setCurrentIndex((current) => (current + 1) % images.length);
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setCurrentIndex(
          (current) => (current - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPreview, hasMultipleImages, images.length]);

  const nextImage = () => {
    setCurrentIndex((safeIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((safeIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="w-full min-w-0">
        {/* الصورة الرئيسية */}
        <div className="relative -mx-3 overflow-hidden bg-[#F7F8F3] sm:mx-0 sm:rounded-3xl">
          <div className="relative flex min-h-[300px] w-full items-center justify-center sm:min-h-0">
            <img
              key={selectedImage}
              src={selectedImage}
              alt={product.name}
              fetchPriority="high"
              onClick={() => setShowPreview(true)}
              className="
                block h-auto max-h-[65vh] min-h-[300px]
                w-full cursor-zoom-in object-contain
                transition-opacity duration-300
                sm:max-h-[600px] sm:min-h-0
              "
            />
          </div>

          {/* شارة التوفر */}
          {product.stock > 0 && (
            <span className="absolute left-3 top-3 z-20 rounded-full border border-green-100 bg-white/95 px-3 py-1.5 text-xs font-bold text-green-800 shadow-sm backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm">
              متوفر
            </span>
          )}

          {/* زر تكبير الصورة */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            aria-label="تكبير صورة المنتج"
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-700 shadow-sm transition hover:bg-green-700 hover:text-white sm:right-5 sm:top-5 sm:h-11 sm:w-11"
          >
            <FaExpand />
          </button>

          {/* أزرار التنقل */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="الصورة السابقة"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-800 shadow-md transition hover:bg-green-700 hover:text-white sm:left-4 sm:h-11 sm:w-11"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="الصورة التالية"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-800 shadow-md transition hover:bg-green-700 hover:text-white sm:right-4 sm:h-11 sm:w-11"
              >
                <FaChevronRight />
              </button>

              <span className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {safeIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* الصور المصغرة */}
        {hasMultipleImages && (
          <div className="mt-4 sm:mt-5">
            <div className="flex gap-2.5 overflow-x-auto px-1 pb-2 sm:gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`عرض الصورة ${index + 1}`}
                  aria-pressed={safeIndex === index}
                  className={`
                    relative h-[68px] w-[68px] shrink-0 overflow-hidden
                    rounded-xl border-2 bg-[#F7F8F3]
                    transition duration-200
                    sm:h-20 sm:w-20 sm:rounded-2xl
                    ${
                      safeIndex === index
                        ? "border-green-700 ring-2 ring-green-100"
                        : "border-transparent hover:border-green-300"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${product.name} - الصورة ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* نافذة تكبير الصورة */}
      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="معاينة صورة المنتج"
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            aria-label="إغلاق الصورة"
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-gray-800 shadow-lg transition hover:bg-green-100 sm:right-7 sm:top-7"
          >
            <FaTimes />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                aria-label="الصورة السابقة"
                onClick={(event) => {
                  event.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg sm:left-7 sm:h-12 sm:w-12"
              >
                <FaChevronLeft />
              </button>

              <button
                type="button"
                aria-label="الصورة التالية"
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg sm:right-7 sm:h-12 sm:w-12"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt={product.name}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-xl object-contain sm:rounded-2xl"
          />

          {hasMultipleImages && (
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              {safeIndex + 1} من {images.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default ProductGallery;
