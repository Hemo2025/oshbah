import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import OffersSection from "../components/common/OffersSection";
import FeaturedProducts from "../components/common/FeaturedProducts";
import NewProducts from "../components/common/NewProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

import { useSettings } from "../hooks/useSettings";
import { useEffect } from "react";

export default function Home() {
  const { settings } = useSettings();

  const isDark = Boolean(settings.theme?.darkMode);

  useEffect(() => {
    document.title = settings.seo?.title || settings.storeName || "عشبة ستور";

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute("content", settings.seo?.description || "");
    }
  }, [settings]);

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-white" : "bg-[#FAF9F3] text-[#263B2A]"
      }`}
      style={{
        "--primary": settings.theme?.primaryColor || "#426B3D",
        "--herbal-primary": settings.theme?.primaryColor || "#426B3D",
        "--herbal-background": isDark ? "#030712" : "#FAF9F3",
      }}
    >
      {/* البانر الرئيسي */}
      {settings.home?.showHero && (
        <section aria-label="البانر الرئيسي">
          <Hero />
        </section>
      )}

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 py-8 sm:gap-16 sm:px-6 sm:py-10 lg:gap-20 lg:px-10 lg:py-12">
        {/* الأقسام */}
        {settings.home?.showCategories && (
          <section
            id="categories"
            aria-label="تسوق حسب الأقسام"
            className="scroll-mt-24"
          >
            <Categories />
          </section>
        )}

        {/* العروض */}
        {settings.discounts?.flashSaleEnabled && (
          <section aria-label="العروض الحالية">
            <OffersSection />
          </section>
        )}

        {/* المنتجات الأكثر تميزًا */}
        {settings.home?.showBestSellers && (
          <section aria-label="المنتجات المميزة">
            <FeaturedProducts />
          </section>
        )}

        {/* لماذا عشبة */}
        <section aria-label="لماذا تختار عشبة">
          <WhyUs />
        </section>

        {/* أحدث المنتجات */}
        {settings.home?.showLatestProducts && (
          <section aria-label="أحدث المنتجات">
            <NewProducts />
          </section>
        )}

        {/* الاشتراك في النشرة البريدية */}
        {settings.popups?.newsletterEnabled && (
          <section aria-label="النشرة البريدية">
            <Newsletter />
          </section>
        )}
      </div>
    </main>
  );
}
