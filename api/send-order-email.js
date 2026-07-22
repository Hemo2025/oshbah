import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
    });
  }

  try {
    const { order } = req.body;

    await resend.emails.send({
      from: "Oshbah <onboarding@resend.dev>",
      to: ["oshbahstore@gmail.com"],
      subject: `طلب جديد ${order.orderNumber}`,
      html: `
        <h2>🛒 طلب جديد</h2>

        <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>

        <p><strong>العميل:</strong> ${order.customer.name}</p>

        <p><strong>الهاتف:</strong> ${order.customer.phone}</p>

        <p><strong>الإجمالي:</strong> ${order.total} ر.س</p>
      `,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
}
