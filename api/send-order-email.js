import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    console.log("API CALLED");
    console.log("BODY:", req.body);

    const { order } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order data missing",
      });
    }

    const result = await resend.emails.send({
      from: "Oshbah <onboarding@resend.dev>",
      to: ["oshbahstore@gmail.com"],
      subject: `🛒 طلب جديد ${order.orderNumber}`,

      html: `
    <div style="font-family: Arial; direction: rtl;">
      <h2>🛒 طلب جديد في متجر عُشبة</h2>

      <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>

      <p><strong>اسم العميل:</strong>
      ${order.customer?.name}</p>

      <p><strong>رقم الجوال:</strong>
      ${order.customer?.phone}</p>

      <p><strong>المدينة:</strong>
      ${order.customer?.city}</p>

      <p><strong>العنوان:</strong>
      ${order.customer?.address}</p>

      <p><strong>الإجمالي:</strong>
      ${order.total} ر.س</p>

      <p><strong>الملاحظات:</strong>
      ${order.customer?.notes || "لا يوجد"}</p>

      <hr>

      <a
        href="https://oshbahstore.com/admin/orders"
        style="
          background:#16a34a;
          color:white;
          padding:12px 20px;
          text-decoration:none;
          border-radius:8px;
          display:inline-block;
        "
      >
        عرض الطلبات
      </a>
    </div>
  `,
    });

    console.log("RESEND RESULT:", result);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
