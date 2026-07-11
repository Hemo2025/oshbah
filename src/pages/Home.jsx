import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import OffersSection from "../components/common/OffersSection";
import FeaturedProducts from "../components/common/FeaturedProducts";
import NewProducts from "../components/common/NewProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />

      <Categories />

      <OffersSection />

      <FeaturedProducts />

      <NewProducts />

      <WhyUs />

      <Newsletter />
    </>
  );
}
