import { useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload, FaUpload, FaCheck, FaTimes } from "react-icons/fa";

import { useStore } from "../hooks/useStore";
import { readProductsExcel, validateProducts } from "../utils/importProducts";

export default function ImportProducts() {
  const { addProduct } = useStore();

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // تحميل قالب Excel
  // تحميل قالب Excel
  const downloadTemplate = () => {
    const headers = [
      "name",
      "price",
      "oldPrice",
      "stock",
      "categories",
      "description",
      "usage",
      "ingredients",
      "seoTitle",
      "seoDescription",
      "seoSlug",
      "images",
    ];

    const example = [
      "اسم المنتج",
      50,
      70,
      10,
      "زيوت, طبيعية",
      "وصف المنتج",
      "طريقة الاستخدام",
      "المكونات",
      "عنوان SEO",
      "وصف SEO",
      "product-slug",
      "https://res.cloudinary.com/uhgjzlgn/image/upload/v123/product1.jpg,https://res.cloudinary.com/uhgjzlgn/image/upload/v123/product2.jpg",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, example]);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "oshbah-products-template.xlsx");
  };

  // قراءة ملف Excel
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const data = await readProductsExcel(file);

      const result = validateProducts(data);
      

      setProducts(result.validProducts);

      setErrors(result.errors);

      setMessage(`تم قراءة ${data.length} منتج`);
    } catch (error) {
      console.error(error);

      setMessage("حدث خطأ أثناء قراءة الملف");
    }
  };

  // رفع المنتجات
  const handleImport = async () => {
    if (!products.length) return;

    setLoading(true);

    try {
      for (const product of products) {
        await addProduct(product);
      }

      setMessage(`تم رفع ${products.length} منتج بنجاح`);

      setProducts([]);
    } catch (error) {
      console.error(error);

      setMessage("حدث خطأ أثناء رفع المنتجات");
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="mb-8 text-3xl font-bold">استيراد المنتجات</h1>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-white hover:bg-green-700"
          >
            <FaDownload />
            تحميل قالب Excel
          </button>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white hover:bg-blue-700">
            <FaUpload />
            اختيار ملف Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-gray-100 p-4">{message}</div>
        )}

        {products.length > 0 && (
          <div className="mt-8 rounded-2xl border p-6">
            <h2 className="mb-4 text-xl font-bold">
              المنتجات الجاهزة للرفع: {products.length}
            </h2>

            <button
              onClick={handleImport}
              disabled={loading}
              className="flex items-center gap-3 rounded-2xl bg-purple-600 px-6 py-4 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <FaCheck />

              {loading ? "جاري الرفع..." : "بدء استيراد المنتجات"}
            </button>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-8 rounded-2xl bg-red-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-red-700">
              <FaTimes />
              أخطاء في الملف
            </h2>

            <ul className="space-y-2 text-red-600">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
