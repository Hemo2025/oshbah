import { useState } from "react";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    stock: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProduct((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.category ||
      !product.stock ||
      !product.image
    ) {
      alert("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    console.log(product);

    alert("تم تجهيز بيانات المنتج، وسيتم ربطها بـ Firebase لاحقًا.");

    setProduct({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      category: "",
      stock: "",
      image: null,
    });

    setPreview(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">إضافة منتج جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">اسم المنتج</label>

            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="اسم المنتج"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">وصف المنتج</label>

            <textarea
              rows="5"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="اكتب وصف المنتج..."
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-semibold">السعر</label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                السعر قبل الخصم
              </label>

              <input
                type="number"
                name="oldPrice"
                value={product.oldPrice}
                onChange={handleChange}
                placeholder="اختياري"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-semibold">التصنيف</label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر التصنيف</option>
                <option value="عسل">عسل</option>
                <option value="أعشاب">أعشاب</option>
                <option value="زيوت">زيوت</option>
                <option value="مكملات">مكملات</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                الكمية بالمخزون
              </label>

              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-semibold">صورة المنتج</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />

            {preview && (
              <div className="mt-5">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-52 h-52 object-cover rounded-xl border shadow"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            إضافة المنتج
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
