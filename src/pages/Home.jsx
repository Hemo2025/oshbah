import Hero from "../components/common/Hero";
import Categories from "../components/common/Categories";
import FeaturedProducts from "../components/common/FeaturedProducts";
import WhyUs from "../components/common/WhyUs";
import Newsletter from "../components/common/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <Newsletter />
    </>
  );
}
