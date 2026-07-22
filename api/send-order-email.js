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

      // مؤقتاً استخدم بريد حساب Resend نفسه للاختبار
      to: ["hammam.buss@gmail.com"],

      subject: `🛒 طلب جديد ${order.orderNumber}`,

      html: `
        <h2>🛒 طلب جديد</h2>

        <p>
          <strong>رقم الطلب:</strong>
          ${order.orderNumber}
        </p>

        <p>
          <strong>العميل:</strong>
          ${order.customer?.name || order.customerName || "غير متوفر"}
        </p>

        <p>
          <strong>الهاتف:</strong>
          ${order.customer?.phone || order.customerPhone || "غير متوفر"}
        </p>

        <p>
          <strong>الإجمالي:</strong>
          ${order.total} ر.س
        </p>

        <hr />

        <pre>
${JSON.stringify(order, null, 2)}
        </pre>
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
