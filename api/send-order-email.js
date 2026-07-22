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
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order data missing",
      });
    }

    const productsHtml =
      order.items
        ?.map(
          (item) => `
            <tr>
              <td style="padding:8px;border:1px solid #eee;">
                ${item.name}
              </td>

              <td style="padding:8px;border:1px solid #eee;text-align:center;">
                ${item.quantity}
              </td>

              <td style="padding:8px;border:1px solid #eee;text-align:center;">
                ${item.price} ر.س
              </td>
            </tr>
          `,
        )
        .join("") || "";

    const result = await resend.emails.send({
      from: "Oshbah <onboarding@resend.dev>",
      to: ["oshbahstore@gmail.com"],
      subject: `🛒 طلب جديد ${order.orderNumber}`,

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            direction:rtl;
            max-width:700px;
            margin:auto;
            padding:20px;
          "
        >
          <h2 style="color:#16a34a;">
            🛒 طلب جديد في متجر عُشبة
          </h2>

          <p><strong>رقم الطلب:</strong> ${order.orderNumber}</p>

          <p><strong>اسم العميل:</strong>
            ${order.customer?.name}
          </p>

          <p><strong>رقم الجوال:</strong>
            ${order.customer?.phone}
          </p>

          <p><strong>المدينة:</strong>
            ${order.customer?.city}
          </p>

          <p><strong>العنوان:</strong>
            ${order.customer?.address}
          </p>

          <p><strong>الملاحظات:</strong>
            ${order.customer?.notes || "لا يوجد"}
          </p>

          <h3>المنتجات</h3>

          <table
            style="
              width:100%;
              border-collapse:collapse;
              margin-top:10px;
            "
          >
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px;border:1px solid #eee;">
                  المنتج
                </th>

                <th style="padding:10px;border:1px solid #eee;">
                  الكمية
                </th>

                <th style="padding:10px;border:1px solid #eee;">
                  السعر
                </th>
              </tr>
            </thead>

            <tbody>
              ${productsHtml}
            </tbody>
          </table>

          <h3 style="margin-top:20px;color:#16a34a;">
            الإجمالي: ${order.total} ر.س
          </h3>

          <a
            href="https://oshbahstore.com/admin/orders"
            style="
              background:#16a34a;
              color:#fff;
              padding:12px 20px;
              text-decoration:none;
              border-radius:8px;
              display:inline-block;
              margin-top:20px;
            "
          >
            عرض الطلبات
          </a>
        </div>
      `,
    });

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
