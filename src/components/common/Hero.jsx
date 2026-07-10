import { FaLeaf } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-green-100 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row">
        {/* Text */}
        <div className="max-w-xl text-center md:text-right">
          <span className="inline-block rounded-full bg-green-200 px-4 py-2 text-sm font-semibold text-green-700">
            منتجات طبيعية 100%
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-800">
            اكتشف قوة الطبيعة مع
            <span className="text-green-600"> عُشبة 🌿</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            أفضل المنتجات الطبيعية والعشبية المختارة بعناية لتحسين صحتك وحياتك
            اليومية.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <button className="rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700">
              تسوق الآن
            </button>

            <button className="rounded-xl border border-green-600 px-8 py-4 font-semibold text-green-700 transition hover:bg-green-50">
              استكشف المنتجات
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex h-80 w-80 items-center justify-center rounded-full bg-green-200 shadow-2xl">
          <FaLeaf className="text-[150px] text-green-600" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
