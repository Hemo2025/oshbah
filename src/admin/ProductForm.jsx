import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave, FaTimes, FaPlus, FaTrash, FaImage } from "react-icons/fa";

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
  images: [],
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

        images: existingProduct.images?.length ? existingProduct.images : [],
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

          <div className="mt-10 rounded-3xl bg-white p-10 shadow">
            المنتج غير موجود
          </div>
        </main>
      </div>
    );
  }

  const handleChange = (field, value) => {
    if (field === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().trim().replace(/\s+/g, "-"),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleListChange = (field, index, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];

      arr[index] = value;

      return {
        ...prev,
        [field]: arr,
      };
    });
  };

  const addListItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeListItem = (field, index) => {
    setForm((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: arr.length > 0 ? arr : [""],
      };
    });
  };

  const handleImages = async (files) => {
    if (!files?.length) return;

    const fileArray = Array.from(files);

    const images = await Promise.all(
      fileArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onloadend = () => resolve(reader.result);

            reader.readAsDataURL(file);
          }),
      ),
    );

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...images],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim() || !form.price || !form.category) {
      setError("يرجى تعبئة الحقول المطلوبة");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock) || 0,
      ingredients: form.ingredients.filter((i) => i.trim()),
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

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="mb-8 text-3xl font-bold">
              {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h1>

            {error && (
              <div className="mb-6 rounded-2xl bg-red-100 p-4 text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">اسم المنتج *</label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-2xl border p-4 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">التصنيف *</label>

                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded-2xl border p-4 outline-none focus:border-green-600"
                >
                  <option value="">اختر التصنيف</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold">السعر</label>

                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  className="w-full rounded-2xl border p-4"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  السعر قبل الخصم
                </label>

                <input
                  type="number"
                  value={form.oldPrice}
                  onChange={(e) => handleChange("oldPrice", e.target.value)}
                  className="w-full rounded-2xl border p-4"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">الكمية</label>

                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  className="w-full rounded-2xl border p-4"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="mb-2 block font-semibold">الوصف</label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-2xl border p-4"
              />
            </div>

            <div className="mt-8">
              <label className="mb-2 block font-semibold">
                طريقة الاستخدام
              </label>

              <textarea
                rows={3}
                value={form.usage}
                onChange={(e) => handleChange("usage", e.target.value)}
                className="w-full rounded-2xl border p-4"
              />
            </div>

            <div className="mt-8">
              <label className="mb-4 block font-semibold">المكونات</label>

              {form.ingredients.map((item, index) => (
                <div key={index} className="mb-3 flex gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListChange("ingredients", index, e.target.value)
                    }
                    className="w-full rounded-2xl border p-4"
                  />

                  <button
                    type="button"
                    onClick={() => removeListItem("ingredients", index)}
                    className="rounded-2xl bg-red-500 px-5 text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addListItem("ingredients")}
                className="mt-2 flex items-center gap-2 text-green-700"
              >
                <FaPlus />
                إضافة مكون
              </button>
            </div>

            <div className="mt-10">
              <label className="mb-4 block text-lg font-semibold">
                صور المنتج
              </label>

              <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-green-400 bg-green-50 hover:bg-green-100">
                <FaImage className="mb-3 text-5xl text-green-600" />

                <span>اضغط لرفع الصور</span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImages(e.target.files)}
                />
              </label>

              {form.images.length > 0 && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {form.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-3xl shadow"
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-52 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-3 top-3 rounded-full bg-red-500 p-3 text-white"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-green-600 px-8 py-4 text-white hover:bg-green-700"
              >
                <FaSave />
                {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="flex items-center gap-2 rounded-2xl bg-gray-200 px-8 py-4"
              >
                <FaTimes />
                إلغاء
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ProductForm;
