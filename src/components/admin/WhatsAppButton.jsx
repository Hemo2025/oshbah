export default function WhatsAppButton({ order }) {
  const sendWhatsApp = () => {
    let phone = String(order.customer.phone).replace(/\D/g, "");

    // تحويل الرقم السعودي من 05 إلى 966
    if (phone.startsWith("05")) {
      phone = "966" + phone.substring(1);
    }

    const message = `
السلام عليكم ${order.customer.name}

شكراً لطلبك من متجر عُشبة

تم استلام طلبك بنجاح.

رقم الطلب:
${order.orderNumber}

تفاصيل الطلب:
${order.items
  ?.map(
    (item) =>
      `- ${item.name} × ${item.quantity} (${item.price * item.quantity} ريال)`,
  )
  .join("\n")}

إجمالي الطلب:😅
${order.total} ريال

طريقة الدفع:
الدفع عند الاستلام

عنوان التوصيل:
${order.customer.city}
${order.customer.address}

حالة الطلب:
جاري المراجعة والتجهيز.

سيتم التواصل معك عند تجهيز الطلب وخروجه للتوصيل.

شكراً لاختيارك متجر عُشبة
`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <button
      onClick={sendWhatsApp}
      className="
      bg-green-500
      text-white
      px-4
      py-2
      rounded-lg
      hover:bg-green-600
      "
    >
      💬 واتساب العميل
    </button>
  );
}
