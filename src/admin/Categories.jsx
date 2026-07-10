import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useStore } from "../hooks/useStore";

const emptyForm = { name: "", image: "" };

function Categories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const productCount = (categoryName) =>
    products.filter((p) => p.category === categoryName).length;

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setForm({ name: category.name, image: category.image || "" });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("اسم التصنيف مطلوب.");
      return;
    }

    const nameExists = categories.some(
      (c) => c.name === form.name.trim() && c.id !== editingId,
    );

    if (nameExists) {
      setError("يوجد تصنيف بنفس الاسم.");
      return;
    }

    if (editingId) {
      updateCategory(editingId, { name: form.name.trim(), image: form.image });
    } else {
      addCategory({ name: form.name.trim(), image: form.image });
    }

    closeForm();
  };

  const handleDelete = (category) => {
    const count = productCount(category.name);

    const message =
      count > 0
        ? `يوجد ${count} منتج مرتبط بهذا التصنيف. هل تريد حذفه فعلاً؟`
        : "هل أنت متأكد من حذف هذا التصنيف؟";

    if (!window.confirm(message)) return;

    deleteCategory(category.id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 rounded-2xl bg-white shadow">
          <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl font-bold">إدارة التصنيفات</h2>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              <FaPlus /> إضافة تصنيف
            </button>
          </div>

          {/* Inline add/edit form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="border-b bg-gray-50 p-6"
            >
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
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    placeholder="مثال: الزيوت الطبيعية"
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
                      setForm((f) => ({ ...f, image: e.target.value }))
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
                  <FaTimes /> إلغاء
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-right">الصورة</th>
                  <th className="p-4 text-right">اسم التصنيف</th>
                  <th className="p-4 text-center">عدد المنتجات</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-t transition hover:bg-gray-50"
                    >
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

                      <td className="font-semibold">{category.name}</td>

                      <td className="text-center">
                        <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                          {productCount(category.name)}
                        </span>
                      </td>

                      <td>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEditForm(category)}
                            className="rounded-lg bg-blue-500 p-3 text-white transition hover:bg-blue-600"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(category)}
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
                    <td colSpan="4" className="py-10 text-center text-gray-500">
                      لا توجد تصنيفات بعد.
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

export default Categories;
