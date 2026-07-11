import { FaLeaf, FaTruck, FaShieldAlt } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* خلفية زخرفية */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-green-200/30 blur-3xl"></div>

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-green-300/20 blur-3xl"></div>

      <div className="mx-auto flex min-h-[650px] max-w-7xl flex-col-reverse items-center justify-between gap-12 px-6 py-16 md:flex-row">
        {/* النص */}
        <div className="max-w-2xl text-center md:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
            🌿 منتجات طبيعية مختارة بعناية
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
            اكتشف جمال الطبيعة مع
            <span className="block text-green-600">عُشبة ستور</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            متجر متخصص في المنتجات الطبيعية والأعشاب والعسل والزيوت والمكملات
            الصحية لتمنحك حياة أكثر صحة وجودة.
          </p>

          {/* أزرار */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link
              to="/Products"
              className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-700"
            >
              تسوق الآن
            </Link>

            <Link
              to="/Products"
              className="rounded-2xl border-2 border-green-600 bg-white px-8 py-4 font-bold text-green-700 transition duration-300 hover:bg-green-50"
            >
              استكشف المنتجات
            </Link>
          </div>

          {/* مميزات */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <FaTruck className="mb-3 text-2xl text-green-600" />
              <p className="font-semibold text-gray-700">توصيل سريع</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-md">
              <FaShieldAlt className="mb-3 text-2xl text-green-600" />
              <p className="font-semibold text-gray-700">منتجات أصلية</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-md col-span-2 md:col-span-1">
              <MdLocalOffer className="mb-3 text-2xl text-green-600" />
              <p className="font-semibold text-gray-700">عروض مستمرة</p>
            </div>
          </div>
        </div>

        {/* الصورة */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-96 w-96 rounded-full bg-green-200/50 blur-2xl"></div>

          <div className="relative flex h-80 w-80 items-center justify-center rounded-full bg-white shadow-2xl md:h-[420px] md:w-[420px]">
            <FaLeaf className="text-[180px] text-green-600 md:text-[220px]" />

            <div className="absolute top-10 right-0 rounded-2xl bg-white px-5 py-3 shadow-lg">
              <p className="text-sm text-gray-500">منتجات طبيعية</p>

              <p className="font-bold text-green-600">+100 منتج</p>
            </div>

            <div className="absolute bottom-10 left-0 rounded-2xl bg-white px-5 py-3 shadow-lg">
              <p className="text-sm text-gray-500">رضا العملاء</p>

              <p className="font-bold text-yellow-500">⭐ 4.9</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
