import * as XLSX from "xlsx";

// قراءة ملف Excel وتحويله إلى منتجات
export function readProductsExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet);

        const products = rows.map((row) => ({
          name: row.name?.trim() || "",

          price: Number(row.price) || 0,

          oldPrice: row.oldPrice ? Number(row.oldPrice) : null,

          stock: Number(row.stock) || 0,

          // مثال:
          // عسل ثيمرا, العروض والبكجات
          categories: row.categories
            ? row.categories
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],

          description: row.description || "",

          usage: row.usage || "",

          ingredients: row.ingredients
            ? row.ingredients
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],

          seoTitle: row.seoTitle || "",

          seoDescription: row.seoDescription || "",

          seoSlug: row.seoSlug || "",

          images: row.images
            ? row.images
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
        }));

        resolve(products);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

// فحص المنتجات قبل رفعها إلى Firebase
export function validateProducts(products) {
  const errors = [];

  const validProducts = products.filter((product, index) => {
    let valid = true;

    if (!product.name) {
      errors.push(`الصف ${index + 2}: اسم المنتج مفقود`);

      valid = false;
    }

    if (!product.price || isNaN(product.price)) {
      errors.push(`الصف ${index + 2}: السعر غير صحيح`);

      valid = false;
    }

    if (!product.categories.length) {
      errors.push(`الصف ${index + 2}: التصنيف مفقود`);

      valid = false;
    }

    return valid;
  });

  return {
    validProducts,
    errors,
  };
}
