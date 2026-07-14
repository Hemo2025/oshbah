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

  useEffect(() => {
    document.title = settings.seo?.title || settings.storeName;

    const meta = document.querySelector('meta[name="description"]');

    if (meta) {
      meta.setAttribute("content", settings.seo?.description || "");
    }
  }, [settings]);

  return (
    <div
      className={`min-h-screen ${
        settings.theme?.darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
      style={{
        "--primary": settings.theme?.primaryColor,
      }}
    >
      {/* بانر رئيسي */}

      {settings.home?.showHero && <Hero />}

      <div className="space-y-20 py-12">
        {/* الأقسام */}

        {settings.home?.showCategories && (
          <section id="categories">
            <Categories />
          </section>
        )}

        {/* العروض */}

        {settings.discounts?.flashSaleEnabled && <OffersSection />}

        {/* المنتجات المميزة */}

        {settings.home?.showBestSellers && <FeaturedProducts />}

        {/* لماذا نحن */}

        <WhyUs />

        {/* أحدث المنتجات */}

        {settings.home?.showLatestProducts && <NewProducts />}

        {/* النشرة البريدية */}

        {settings.popups?.newsletterEnabled && <Newsletter />}
      </div>
    </div>
  );
}
