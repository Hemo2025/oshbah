import { FaLeaf, FaTruck, FaShieldAlt, FaHeadset } from "react-icons/fa";

function WhyUs() {
  const features = [
    {
      icon: <FaLeaf />,
      title: "منتجات طبيعية",
      desc: "منتجات مختارة بعناية من أفضل المصادر الطبيعية.",
    },
    {
      icon: <FaTruck />,
      title: "شحن سريع",
      desc: "توصيل سريع لجميع مناطق المملكة.",
    },
    {
      icon: <FaShieldAlt />,
      title: "جودة مضمونة",
      desc: "ضمان الجودة على جميع المنتجات.",
    },
    {
      icon: <FaHeadset />,
      title: "دعم متواصل",
      desc: "فريق دعم جاهز لمساعدتك في أي وقت.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-14 text-center text-4xl font-bold text-gray-800">
          لماذا تختار عُشبة ستور؟ 🌿
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                border
                p-8
                text-center
                shadow-sm
                transition
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              <div className="mb-6 text-5xl text-green-600 flex justify-center">
                {item.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>

              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyUs;
