import { Helmet } from "react-helmet-async";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>الشروط والأحكام | عُشبة ستور</title>

        <meta
          name="description"
          content="تعرف على الشروط والأحكام الخاصة باستخدام متجر عُشبة وإتمام عمليات الشراء."
        />

        <link rel="canonical" href="https://oshbahstore.com/terms" />
      </Helmet>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg md:p-12">
          <h1 className="mb-8 text-center text-4xl font-bold text-green-700">
            الشروط والأحكام
          </h1>

          <div className="space-y-8 text-gray-700 leading-8">
            <p>
              باستخدامك لموقع عُشبة فإنك توافق على الالتزام بالشروط والأحكام
              التالية.
            </p>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                الطلبات
              </h2>

              <p>
                يحق للمتجر قبول أو رفض أي طلب في حال وجود خطأ في الأسعار أو نفاد
                الكمية أو لأي سبب مشروع.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                الأسعار
              </h2>

              <p>
                جميع الأسعار قابلة للتغيير دون إشعار مسبق، ويتم اعتماد السعر
                الظاهر عند إتمام الطلب.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                مسؤولية الاستخدام
              </h2>

              <p>
                يتحمل العميل مسؤولية استخدام المنتجات وفق التعليمات المرفقة، ولا
                يتحمل المتجر أي مسؤولية عن سوء الاستخدام.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                حقوق الملكية
              </h2>

              <p>
                جميع المحتويات والصور والشعارات الخاصة بمتجر عُشبة محفوظة
                الحقوق، ولا يجوز استخدامها دون إذن مسبق.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
