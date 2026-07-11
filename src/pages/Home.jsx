import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import OffersSection from "../components/common/OffersSection";
import FeaturedProducts from "../components/common/FeaturedProducts";
import NewProducts from "../components/common/NewProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <Hero />

      <div className="space-y-20 py-12">
        <Categories />

        <OffersSection />

        <FeaturedProducts />

        <WhyUs />

        <NewProducts />

        <Newsletter />
      </div>
    </div>
  );
}
