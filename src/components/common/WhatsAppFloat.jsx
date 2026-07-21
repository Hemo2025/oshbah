import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useStore } from "../../hooks/useStore";

export default function WhatsAppFloat() {
  const phone = "966599304548";

  const location = useLocation();
  const { products } = useStore();

  const currentProduct = products.find(
    (p) => location.pathname === `/product/${p.slug}`,
  );

  let message = "السلام عليكم، أريد الاستفسار عن منتجات عُشبة ستور.";

  if (currentProduct) {
    message = `مرحباً 👋

أرغب بالاستفسار عن هذا المنتج في عُشبة ستور:

🛍️ المنتج: ${currentProduct.name}

💰 السعر: ${currentProduct.price} ر.س

🔗 رابط المنتج:
${window.location.href}`;
  }

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-5 left-5 z-[9999]
        flex items-center gap-3
        rounded-full bg-[#25D366]
        px-4 py-3 text-white
        shadow-2xl transition-all duration-300
        hover:scale-105 whatsapp-btn
      "
    >
      <FaWhatsapp size={30} />

      <div className="hidden sm:block">
        <p className="text-sm font-bold">تحدث معنا</p>

        <p className="text-xs opacity-90">خدمة عملاء عُشبة ستور</p>
      </div>
    </a>
  );
}
