import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useStore } from "../hooks/useStore";
import { downloadProductTemplate } from "../utils/excelTemplate"; //اضافة ملف اكسل
import { readProductsExcel } from "../utils/importProducts";
function Products() {
  const { addProduct } = useStore();

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const products = await readProductsExcel(file);

      console.log(products);

      for (const product of products) {
        await addProduct(product);
      }

      alert(`تم رفع ${products.length} منتجات بنجاح`);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء قراءة الملف");
    }
  };
  const navigate = useNavigate();
  const { products, categories, deleteProduct } = useStore();

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoriesText = Array.isArray(product.categories)
        ? product.categories.join(" ")
        : product.category || "";

      return (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        categoriesText.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [products, search]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");

    if (!confirmDelete) return;

    deleteProduct(id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 rounded-2xl bg-white shadow">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl font-bold">إدارة المنتجات</h2>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative">
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-72 rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => navigate("/admin/add-product")}
                className="rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
              >
                + إضافة منتج
              </button>
              <button
                onClick={() => downloadProductTemplate(categories)}
                className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
              >
                📥 تحميل قالب Excel
              </button>
              <label className="cursor-pointer rounded-xl bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-700">
                📤 رفع Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  hidden
                  onChange={handleExcelUpload}
                />
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-right">الصورة</th>

                  <th className="p-4 text-right">اسم المنتج</th>

                  <th className="p-4 text-right">التصنيف</th>

                  <th className="p-4 text-right">السعر</th>

                  <th className="p-4 text-center">المخزون</th>

                  <th className="p-4 text-center">الحالة</th>

                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t transition hover:bg-gray-50"
                    >
                      <td className="p-4">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                            بدون صورة
                          </div>
                        )}
                      </td>

                      <td className="font-semibold">{product.name}</td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          {(product.categories || [product.category]).map(
                            (cat, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                              >
                                {cat}
                              </span>
                            ),
                          )}
                        </div>
                      </td>

                      <td className="font-semibold text-green-700">
                        {product.price} ر.س
                      </td>

                      <td className="text-center">
                        <span
                          className={`rounded-full px-4 py-1 text-sm font-medium ${
                            product.stock > 5
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="text-center">
                        {product.stock > 5 ? (
                          <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                            متوفر
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-4 py-1 text-sm text-red-700">
                            منخفض
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/edit-product/${product.id}`)
                            }
                            className="rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg bg-red-500 p-3 text-white transition hover:bg-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500">
                      لا توجد منتجات مطابقة للبحث.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Products;
