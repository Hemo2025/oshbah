import QRCode from "qrcode";
export default function OrderInvoice({ order }) {
  const printInvoice = async () => {
    const qrText = `
متجر عُشبة
رقم الطلب: ${order.orderNumber}
العميل: ${order.customer?.name}
الجوال: ${order.customer?.phone}
الإجمالي: ${order.total} ريال
`;

    const qrImage = await QRCode.toDataURL(qrText);
    const width = 900;
    const height = 750;

    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const invoiceWindow = window.open(
      "",
      "_blank",
      `
      width=${width},
      height=${height},
      top=${top},
      left=${left},
      resizable=yes,
      scrollbars=yes
      `,
    );

    invoiceWindow.document.write(`

    <html dir="rtl">

    <head>

    <title>
    فاتورة ${order.orderNumber}
    </title>


<style>

body {
  font-family: Arial, sans-serif;
  color:#222;
  direction:rtl;
  width:80mm;
  padding:8px;
  margin:0 auto;
}


h1 {
  text-align:center;
  color:#15803d;
  font-size:22px;
  margin-bottom:15px;
}


.card {
  border:1px dashed #999;
  border-radius:8px;
  padding:8px;
  margin-bottom:10px;
}


.card h3 {
  font-size:16px;
  margin:5px 0 10px;
}


p {
  margin:5px 0;
  font-size:13px;
}


.product {
  display:flex;
  align-items:center;
  gap:8px;
  border-bottom:1px dashed #ccc;
  padding:8px 0;
}


.product img {
  width:45px;
  height:45px;
  object-fit:cover;
  border-radius:5px;
}


.total {
  text-align:center;
  font-size:20px;
  font-weight:bold;
  color:#15803d;
  margin-top:15px;
}



@media print {

  @page {

    size:100mm 150mm;

    margin:5mm;

  }


  body {

    width:80mm;

    padding:0;

  }


  button {

    display:none;

  }

}

</style>

    </head>


    <body>


    <h1>
    متجر عُشبة 🌿
    </h1>


    <div class="card">

    <h3>
    بيانات الطلب
    </h3>

    <p>
    رقم الطلب:
    ${order.orderNumber}
    </p>


    <p>
    التاريخ:
    ${
      order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleString("ar-SA")
        : new Date(order.date).toLocaleString("ar-SA")
    }
    </p>


    <p>
    طريقة الدفع:
    الدفع عند الاستلام
    </p>


    </div>



    <div class="card">

    <h3>
    بيانات العميل
    </h3>


    <p>
    الاسم:
    ${order.customer?.name}
    </p>


    <p>
    الجوال:
    ${order.customer?.phone}
    </p>


    <p>
    المدينة:
    ${order.customer?.city}
    </p>


    <p>
    العنوان:
    ${order.customer?.address}
    </p>


    </div>



    <div class="card">

    <h3>
    المنتجات
    </h3>


    ${order.items
      ?.map(
        (item) => `

      <div class="product">

      <img src="${item.image}" />


      <div>

      <strong>
      ${item.name}
      </strong>


      <p>
      الكمية:
      ${item.quantity}
      </p>


      <p>
      السعر:
      ${item.price} ريال
      </p>


      </div>


      </div>


      `,
      )
      .join("")}


    </div>



    <div class="total">

    الإجمالي:
    ${order.total}
    ريال

    </div>

<div style="text-align:center;margin-top:15px">

<img 
src="${qrImage}" 
style="
width:100px;
height:100px;
"
/>

<p>
امسح لمعلومات الطلب
</p>

</div>

    <script>

    window.onload = function(){

      setTimeout(() => {

        window.print();

      }, 500);

    }

    </script>


    </body>

    </html>

    `);

    invoiceWindow.document.close();
  };

  return (
    <button
      onClick={printInvoice}
      className="
      bg-green-600
      text-white
      px-4
      py-2
      rounded-lg
      hover:bg-green-700
      "
    >
      🧾 طباعة فاتورة
    </button>
  );
}
