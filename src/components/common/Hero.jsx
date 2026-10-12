import { useEffect, useRef, useState } from "react";
import {
  FaLeaf,
  FaTruck,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

function Hero() {
  const { settings } = useSettings();
  const sliderSettings = settings?.heroSlider || {};
  const homeSettings = settings?.home || {};

  const banners = (settings?.banners || []).filter(
    (banner) => banner?.active && banner?.image,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const bannerCount = banners.length;
  const safeIndex = bannerCount > 0 ? currentIndex % bannerCount : 0;

  const sliderEnabled =
    sliderSettings.enabled !== false && homeSettings.showHero !== false;

  const autoplay = sliderSettings.autoplay !== false;
  const autoplayDelay = Math.max(
    2000,
    Number(sliderSettings.autoplayDelay) || 5000,
  );

  const showArrows = sliderSettings.showArrows !== false;
  const showDots = sliderSettings.showDots !== false;

  const desktopHeight = Math.max(
    200,
    Number(sliderSettings.desktopHeight) || 420,
  );

  const mobileHeight = Math.max(
    160,
    Number(sliderSettings.mobileHeight) || 220,
  );

  useEffect(() => {
    if (!sliderEnabled || !autoplay || bannerCount <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % bannerCount);
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [sliderEnabled, autoplay, autoplayDelay, bannerCount]);

  const goToSlide = (index) => {
    if (bannerCount <= 0) return;

    setCurrentIndex((index + bannerCount) % bannerCount);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) > 45) {
      goToSlide(safeIndex + (difference > 0 ? 1 : -1));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // إخفاء القسم إذا عطّله المسؤول من الإعدادات
  if (homeSettings.showHero === false) {
    return null;
  }

  // عرض البنرات التي تتم إدارتها من لوحة التحكم
  if (sliderEnabled && bannerCount > 0) {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#F8F6EE]"
        aria-label="البنرات الرئيسية"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `clamp(${mobileHeight}px, 45vw, ${desktopHeight}px)`,
          }}
        >
          {banners.map((item, index) => (
            <div
              key={item.id || `${item.image}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === safeIndex
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0 pointer-events-none"
              }`}
              aria-hidden={index !== safeIndex}
            >
              {item.link ? (
                <Link
                  to={item.link}
                  tabIndex={index === safeIndex ? 0 : -1}
                  aria-label={item.alt || `عرض البنر ${index + 1}`}
                  className="block h-full w-full"
                >
                  <img
                    src={item.image}
                    alt={item.alt || `بنر عُشبة ستور ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                    draggable="false"
                    loading={index === safeIndex ? "eager" : "lazy"}
                  />
                </Link>
              ) : (
                <img
                  src={item.image}
                  alt={item.alt || `بنر عُشبة ستور ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                  draggable="false"
                  loading={index === safeIndex ? "eager" : "lazy"}
                />
              )}
            </div>
          ))}

          {bannerCount > 1 && showArrows && (
            <>
              <button
                type="button"
                onClick={() => goToSlide(safeIndex + 1)}
                aria-label="البنر التالي"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-green-800 shadow-md transition hover:bg-white sm:right-6 sm:h-12 sm:w-12"
              >
                <FaChevronRight />
              </button>

              <button
                type="button"
                onClick={() => goToSlide(safeIndex - 1)}
                aria-label="البنر السابق"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/85 text-green-800 shadow-md transition hover:bg-white sm:left-6 sm:h-12 sm:w-12"
              >
                <FaChevronLeft />
              </button>
            </>
          )}

          {bannerCount > 1 && showDots && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm sm:bottom-6">
              {banners.map((item, index) => (
                <button
                  key={item.id || `${item.image}-${index}`}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`الانتقال إلى البنر ${index + 1}`}
                  aria-current={index === safeIndex ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === safeIndex
                      ? "w-7 bg-white"
                      : "w-2.5 bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // التصميم الاحتياطي عند عدم وجود بنرات مفعّلة
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F6EE] via-white to-green-100">
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-300/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col-reverse items-center justify-between gap-12 px-5 py-14 sm:px-8 md:flex-row md:py-16">
        <div className="max-w-2xl text-center md:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-800">
            <FaLeaf />
            منتجات طبيعية مختارة بعناية
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
            اكتشف جمال الطبيعة مع
            <span className="mt-2 block text-green-700">عُشبة ستور</span>
          </h1>

          <p className="mt-6 text-base leading-8 text-gray-600 sm:text-lg">
            اكتشف تشكيلة منتجات المتجر وتصفح ما يناسبك من الأعشاب والعسل والزيوت
            وغيرها.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              to="/Products"
              className="rounded-xl bg-green-700 px-7 py-3.5 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-800"
            >
              تسوق الآن
            </Link>

            <Link
              to="/Products"
              className="rounded-xl border border-green-700 bg-white px-7 py-3.5 font-bold text-green-800 transition hover:bg-green-50"
            >
              استكشف المنتجات
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-green-100 bg-white/90 p-4 shadow-sm">
              <FaTruck className="mb-3 text-2xl text-green-700" />
              <p className="font-semibold text-gray-700">خدمة التوصيل</p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-white/90 p-4 shadow-sm">
              <FaShieldAlt className="mb-3 text-2xl text-green-700" />
              <p className="font-semibold text-gray-700">تسوق بكل سهولة</p>
            </div>

            <div className="col-span-2 rounded-2xl border border-green-100 bg-white/90 p-4 shadow-sm sm:col-span-1">
              <MdLocalOffer className="mb-3 text-2xl text-green-700" />
              <p className="font-semibold text-gray-700">عروض المتجر</p>
            </div>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center justify-center">
          <div className="absolute h-72 w-72 rounded-full bg-green-200/50 blur-2xl sm:h-96 sm:w-96" />
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-green-100 bg-white shadow-xl sm:h-80 sm:w-80">
            <FaLeaf className="text-[140px] text-green-700 sm:text-[180px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
