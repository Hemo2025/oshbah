import { FaWhatsapp, FaInstagram, FaTruck, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold text-green-400 mb-4">عُشبة</h2>

            <p className="text-gray-300 leading-8">
              متجر متخصص في المنتجات الطبيعية والعناية الصحية، نوفر منتجات أصلية
             مع شحن سريع.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-5">روابط سريعة</h3>

            <div className="flex flex-col gap-3 text-gray-300">
              <Link to="/">الرئيسية</Link>
              <Link to="/products">المنتجات</Link>
              <Link to="/products?category=العروض+والبكجات">العروض</Link>
              <Link to="/about">تواصل معنا</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-5">تواصل معنا</h3>

            <div className="space-y-4 text-gray-300">
              {/* <p>واتساب: 05xxxxxxxx</p> */}
              <p>oshbahstore@gmail.com</p>
              {/* <p>الرياض - المملكة العربية السعودية</p> */}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-lg mb-5">لماذا عُشبة ؟</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaTruck className="text-green-400" />
                <span>شحن سريع</span>
              </div>

              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-green-400" />
                <span>دفع آمن</span>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-400" />
                <span>دعم عبر واتساب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="border-t border-green-900 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 عُشبة | جميع الحقوق محفوظة
          </p>

          <div className="flex gap-4 text-2xl">
            <a href="#">
              <FaInstagram className="hover:text-green-400 duration-300" />
            </a>

            <a href="#">
              <FaWhatsapp className="hover:text-green-400 duration-300" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
