import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية | عُشبة ستور</title>

        <meta
          name="description"
          content="تعرف على سياسة الخصوصية وكيفية حماية بيانات العملاء في متجر عُشبة."
        />

        <link rel="canonical" href="https://oshbahstore.com/privacy-policy" />
      </Helmet>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg md:p-12">
          <h1 className="mb-8 text-center text-4xl font-bold text-green-700">
            سياسة الخصوصية
          </h1>

          <div className="space-y-8 text-gray-700 leading-8">
            <p>
              يلتزم متجر عُشبة بحماية خصوصية العملاء وعدم مشاركة بياناتهم مع أي
              جهة إلا عند الحاجة لإتمام الطلب أو وفقًا للأنظمة المعمول بها.
            </p>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                البيانات التي نجمعها
              </h2>

              <ul className="list-disc space-y-2 pr-6">
                <li>الاسم.</li>
                <li>رقم الجوال.</li>
                <li>البريد الإلكتروني.</li>
                <li>عنوان الشحن.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                استخدام البيانات
              </h2>

              <ul className="list-disc space-y-2 pr-6">
                <li>تنفيذ الطلبات.</li>
                <li>التواصل مع العملاء.</li>
                <li>تحسين تجربة المستخدم.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-bold text-green-700">
                حماية المعلومات
              </h2>

              <p>
                نتخذ الإجراءات الأمنية المناسبة لحماية معلومات العملاء ومنع
                الوصول غير المصرح به إليها.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
