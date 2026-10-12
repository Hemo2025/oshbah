import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import AdminLayout from "../components/layout/AdminLayout";
import { useStore } from "../hooks/useStore";

const emptyForm = { name: "", image: "" };

function Categories() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [reordering, setReordering] = useState(false);

  const productCount = (categoryName) =>
    products.filter(
      (product) =>
        product.category === categoryName ||
        product.categories?.includes(categoryName),
    ).length;

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setForm({
      name: category.name,
      image: category.image || "",
    });
    setEditingId(category.id);
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("اسم التصنيف مطلوب.");
      return;
    }

    const nameExists = categories.some(
      (category) =>
        category.name === form.name.trim() && category.id !== editingId,
    );

    if (nameExists) {
      setError("يوجد تصنيف بنفس الاسم.");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name.trim(),
          image: form.image,
        });
      } else {
        await addCategory({
          name: form.name.trim(),
          image: form.image,
        });
      }

      closeForm();
    } catch (err) {
      console.error("Category save error:", err);
      setError("تعذر حفظ التصنيف. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleDelete = async (category) => {
    const count = productCount(category.name);

    const message =
      count > 0
        ? `يوجد ${count} منتج مرتبط بهذا التصنيف. هل تريد حذفه فعلاً؟`
        : "هل أنت متأكد من حذف هذا التصنيف؟";

    if (!window.confirm(message)) return;

    try {
      await deleteCategory(category.id);
    } catch (err) {
      console.error("Category delete error:", err);
      window.alert("تعذر حذف التصنيف. يرجى المحاولة مرة أخرى.");
    }
  };

  const moveCategory = async (index, direction) => {
    const nextIndex = index + direction;

    if (reordering || nextIndex < 0 || nextIndex >= categories.length) {
      return;
    }

    const orderedCategories = [...categories];
    const [movedCategory] = orderedCategories.splice(index, 1);

    orderedCategories.splice(nextIndex, 0, movedCategory);

    setReordering(true);

    try {
      await reorderCategories(orderedCategories);
    } catch (err) {
      console.error("Category reorder error:", err);
      window.alert("تعذر حفظ ترتيب التصنيفات. حاول مرة أخرى.");
    } finally {
      setReordering(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mt-8 rounded-2xl bg-white shadow">
        <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold">إدارة التصنيفات</h2>
            <p className="mt-2 text-sm text-gray-500">
              استخدم الأسهم لتغيير ترتيب ظهور التصنيفات في المتجر.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
          >
            <FaPlus />
            إضافة تصنيف
          </button>
        </div>

        {/* نموذج إضافة وتعديل التصنيف */}
        {showForm && (
          <form onSubmit={handleSubmit} className="border-b bg-gray-50 p-6">
            {error && (
              <div className="mb-4 rounded-xl bg-red-100 p-3 text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  اسم التصنيف *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="مثال: الزيوت الطبيعية"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  رابط الصورة (اختياري)
                </label>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      image: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
              >
                {editingId ? "حفظ التعديلات" : "إضافة"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
              >
                <FaTimes />
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* جدول التصنيفات */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-right">الترتيب</th>
                <th className="p-4 text-right">الصورة</th>
                <th className="p-4 text-right">اسم التصنيف</th>
                <th className="p-4 text-center">عدد المنتجات</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="mb-1 text-sm font-bold text-gray-500">
                          {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => moveCategory(index, -1)}
                          disabled={index === 0 || reordering}
                          aria-label={`تقديم ${category.name}`}
                          title="تقديم التصنيف"
                          className="rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-green-100 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaArrowUp />
                        </button>

                        <button
                          type="button"
                          onClick={() => moveCategory(index, 1)}
                          disabled={
                            index === categories.length - 1 || reordering
                          }
                          aria-label={`تأخير ${category.name}`}
                          title="تأخير التصنيف"
                          className="rounded-lg bg-gray-100 p-2 text-gray-700 transition hover:bg-green-100 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>

                    <td className="p-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                          بدون صورة
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-semibold">{category.name}</td>

                    <td className="p-4 text-center">
                      <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                        {productCount(category.name)}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          aria-label={`تعديل ${category.name}`}
                          className="rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          aria-label={`حذف ${category.name}`}
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
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    لا توجد تصنيفات بعد.
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

export default Categories;
