import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useStore } from "../hooks/useStore";

const emptyProduct = {
  name: "",
  slug: "",
  price: "",
  oldPrice: "",
  stock: "",
  category: "",
  description: "",
  usage: "",
  ingredients: [""],
  images: [""],
};

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { categories, addProduct, updateProduct, getProductById } = useStore();

  const existingProduct = isEditing ? getProductById(id) : null;

  const [form, setForm] = useState(() => {
    if (existingProduct) {
      return {
        ...existingProduct,
        ingredients: existingProduct.ingredients?.length
          ? existingProduct.ingredients
          : [""],
        images: existingProduct.images?.length ? existingProduct.images : [""],
      };
    }
    return emptyProduct;
  });

  const [error, setError] = useState("");

  if (isEditing && !existingProduct) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <Header />
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-lg text-gray-600">المنتج غير موجود.</p>
            <button
              onClick={() => navigate("/admin/products")}
              className="mt-4 rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              العودة لقائمة المنتجات
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field, index, value) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field, index) => {
    setForm((prev) => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length ? list : [""] };
    });
  };
  const handleFileUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      handleListChange("images", index, reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.price || !form.category) {
      setError("الاسم والسعر والتصنيف حقول إلزامية.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock) || 0,
      ingredients: form.ingredients.filter((i) => i.trim() !== ""),
      images: form.images.filter((i) => i.trim() !== ""),
    };

    if (isEditing) {
      updateProduct(existingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    navigate("/admin/products");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-white p-8 shadow"
        >
          <h2 className="mb-6 text-3xl font-bold">
            {isEditing ? "تعديل منتج" : "إضافة منتج جديد"}
          </h2>

          {error && (
            <div className="mb-6 rounded-xl bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                اسم المنتج *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                placeholder="مثال: عسل السدر اليمني"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                التصنيف *
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              >
                <option value="">اختر تصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                السعر (ر.س) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                السعر قبل الخصم (اختياري)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice || ""}
                onChange={(e) => handleChange("oldPrice", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                الكمية بالمخزون
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-semibold text-gray-700">
              الوصف
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-semibold text-gray-700">
              طريقة الاستخدام
            </label>
            <textarea
              value={form.usage}
              onChange={(e) => handleChange("usage", e.target.value)}
              rows={2}
              className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
            />
          </div>

          {/* Ingredients list */}
          <div className="mt-6">
            <label className="mb-2 block font-semibold text-gray-700">
              المكونات
            </label>
            {form.ingredients.map((ing, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) =>
                    handleListChange("ingredients", index, e.target.value)
                  }
                  className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                  placeholder="مكوّن"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("ingredients", index)}
                  className="rounded-xl bg-red-500 px-4 text-white hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("ingredients")}
              className="mt-1 flex items-center gap-2 text-sm font-medium text-green-700 hover:underline"
            >
              <FaPlus /> إضافة مكوّن
            </button>
          </div>

          {/* Images list */}
          <div className="mt-6">
            <label className="mb-3 block font-semibold text-gray-700">
              صور المنتج
            </label>
            {form.images.map((img, index) => (
              <div
                key={index}
                className="mb-4 rounded-2xl border bg-gray-50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) =>
                      handleListChange("images", index, e.target.value)
                    }
                    className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    placeholder="https://example.com/image.jpg"
                  />

                  <button
                    type="button"
                    onClick={() => removeListItem("images", index)}
                    className="rounded-xl bg-red-500 px-4 text-white hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <label className="cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
                    📷 رفع صورة
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(index, e.target.files[0])
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();

                        handleListChange("images", index, text);
                      } catch {
                        alert("تعذر الوصول إلى الحافظة");
                      }
                    }}
                    className="rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
                  >
                    📋 لصق رابط
                  </button>
                </div>

                {img && (
                  <div className="mt-4">
                    <img
                      src={img}
                      alt="preview"
                      className="h-40 w-40 rounded-xl border object-cover shadow"
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addListItem("images")}
              className="mt-1 flex items-center gap-2 text-sm font-medium text-green-700 hover:underline"
            >
              <FaPlus /> إضافة رابط صورة
            </button>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
              <FaSave /> {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex items-center gap-2 rounded-xl bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
            >
              <FaTimes /> إلغاء
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProductForm;
