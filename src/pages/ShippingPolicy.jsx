import { Helmet } from "react-helmet-async";

export default function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>سياسة الشحن والتوصيل | عُشبة ستور</title>

        <meta
          name="description"
          content="تعرف على سياسة الشحن والتوصيل ومدة التسليم ورسوم الشحن في متجر عُشبة."
        />

        <link rel="canonical" href="https://oshbahstore.com/shipping-policy" />
      </Helmet>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg md:p-12">
          <h1 className="mb-8 text-center text-4xl font-bold text-green-700">
            سياسة الشحن والتوصيل
          </h1>

          <div className="space-y-8 text-gray-700 leading-8">
            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                مناطق الشحن
              </h2>

              <p>
                يوفر متجر عُشبة خدمة الشحن إلى جميع مدن المملكة العربية السعودية
                عبر شركات شحن معتمدة.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                مدة التوصيل
              </h2>

              <ul className="list-disc space-y-2 pr-6">
                <li>داخل المدن الرئيسية: من 1 إلى 3 أيام عمل.</li>
                <li>باقي المدن: من 3 إلى 7 أيام عمل.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                رسوم الشحن
              </h2>

              <p>
                يتم احتساب رسوم الشحن عند إتمام الطلب، وقد تتوفر عروض شحن مجاني
                لبعض الطلبات.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                تتبع الطلب
              </h2>

              <p>
                بعد شحن الطلب سيتم إرسال رقم التتبع للعميل لمتابعة حالة الشحنة.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
