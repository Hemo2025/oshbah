import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaThumbtack } from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";

import { useStore } from "../hooks/useStore";
import { downloadProductTemplate } from "../utils/excelTemplate";
import { readProductsExcel } from "../utils/importProducts";

function Products() {
  const {
    products = [],
    categories = [],
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [updatingPinId, setUpdatingPinId] = useState(null);

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const importedProducts = await readProductsExcel(file);

      for (const product of importedProducts) {
        await addProduct(product);
      }

      alert(`تم رفع ${importedProducts.length} منتجات بنجاح`);
    } catch (error) {
      console.error("Excel upload error:", error);
      alert("حدث خطأ أثناء قراءة الملف أو حفظ المنتجات");
    } finally {
      e.target.value = "";
    }
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoriesText = Array.isArray(product.categories)
        ? product.categories.join(" ")
        : product.category || "";

      return (
        (product.name || "").toLowerCase().includes(query) ||
        categoriesText.toLowerCase().includes(query)
      );
    });
  }, [products, search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Delete product error:", error);
      alert("تعذر حذف المنتج، حاول مرة أخرى");
    }
  };

  const handleTogglePin = async (product) => {
    if (updatingPinId === product.id) return;

    const nextPinnedState = product.isPinned !== true;

    setUpdatingPinId(product.id);

    try {
      await updateProduct(product.id, {
        isPinned: nextPinnedState,
      });
    } catch (error) {
      console.error("Toggle product pin error:", error);
      alert("تعذر تحديث حالة تثبيت المنتج، حاول مرة أخرى");
    } finally {
      setUpdatingPinId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold">إدارة المنتجات</h2>

          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border py-3 pl-4 pr-11 outline-none focus:border-green-500 md:w-64"
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

            <label className="cursor-pointer rounded-xl bg-purple-600 px-6 py-3 text-center text-white transition hover:bg-purple-700">
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

        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-right">الصورة</th>
                <th className="p-4 text-right">اسم المنتج</th>
                <th className="p-4 text-right">التصنيف</th>
                <th className="p-4 text-right">السعر</th>
                <th className="p-4 text-center">المخزون</th>
                <th className="p-4 text-center">الحالة</th>
                <th className="p-4 text-center">التثبيت</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-t transition hover:bg-gray-50 ${
                      product.isPinned === true ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <td className="p-4">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name || "صورة المنتج"}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                          بدون صورة
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2">
                        {product.isPinned === true && (
                          <FaThumbtack
                            className="shrink-0 text-amber-600"
                            title="منتج مثبّت"
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {(
                          product.categories ||
                          (product.category ? [product.category] : [])
                        ).map((cat, index) => (
                          <span
                            key={`${cat}-${index}`}
                            className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-green-700">
                      {product.price} ر.س
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-medium ${
                          Number(product.stock) > 5
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock ?? 0}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      {Number(product.stock) > 5 ? (
                        <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                          متوفر
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-4 py-1 text-sm text-red-700">
                          منخفض
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(product)}
                        disabled={updatingPinId === product.id}
                        aria-pressed={product.isPinned === true}
                        title={
                          product.isPinned === true
                            ? "إلغاء تثبيت المنتج"
                            : "تثبيت المنتج"
                        }
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60 ${
                          product.isPinned === true
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <FaThumbtack />
                        {updatingPinId === product.id
                          ? "جارٍ الحفظ..."
                          : product.isPinned === true
                            ? "مثبّت"
                            : "تثبيت"}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/edit-product/${product.id}`)
                          }
                          aria-label={`تعديل ${product.name}`}
                          title="تعديل المنتج"
                          className="rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id)}
                          aria-label={`حذف ${product.name}`}
                          title="حذف المنتج"
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
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    لا توجد منتجات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Products;
