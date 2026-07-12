import { FaLeaf } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <FaLeaf className="text-3xl text-green-500" />

            <h2 className="text-3xl font-bold">عُشبة</h2>
          </div>

          <p className="mt-5 text-gray-400">
            متجر متخصص في المنتجات الطبيعية والعشبية.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-xl font-bold">روابط سريعة</h3>

          <ul className="space-y-3 text-gray-400">
            <li>الرئيسية</li>
            <li>المتجر</li>
            <li>التصنيفات</li>
            <li>تواصل معنا</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xl font-bold">تواصل معنا</h3>

          <p className="text-gray-400">KSA - TURKIA</p>

          <p className="mt-2 text-gray-400">oshbahstore@gmail.com</p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500">
        © {new Date().getFullYear()} عُشبة - جميع الحقوق محفوظة
      </div>
    </footer>
  );
}

export default Footer;
