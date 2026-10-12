import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { StoreContext } from "./store-context-instance";

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المنتجات والتصنيفات من Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));

        const productsData = productsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setProducts(productsData);

        const categoriesSnapshot = await getDocs(collection(db, "categories"));

        const categoriesData = categoriesSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        // التصنيفات القديمة التي لا تملك sortOrder تبقى في القائمة
        // مع الحفاظ على ترتيبها الحالي إلى أن يحدد المستخدم ترتيبًا جديدًا.
        setCategories(
          categoriesData
            .map((category, index) => ({
              ...category,
              sortOrder:
                typeof category.sortOrder === "number"
                  ? category.sortOrder
                  : index,
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
      } catch (error) {
        console.error("Firebase load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------------- Products ----------------

  const addProduct = async (product) => {
    const newProduct = {
      ...product,

      category: product.categories?.[0] || product.category || "",

      categories: product.categories || [],

      slug: product.slug ? slugify(product.slug) : slugify(product.name),

      seoSlug: product.seoSlug
        ? slugify(product.seoSlug)
        : slugify(product.name),

      seoTitle: product.seoTitle || product.name,

      seoDescription: product.seoDescription || "",

      rating: 5,
      reviews: 0,

      images: product.images || [],
      ingredients: product.ingredients || [],

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      status: "active",
    };

    const ref = await addDoc(collection(db, "products"), newProduct);

    const savedProduct = {
      id: ref.id,
      ...newProduct,
    };

    setProducts((prev) => [...prev, savedProduct]);

    return savedProduct;
  };

  const updateProduct = async (id, updates) => {
    const productRef = doc(db, "products", id);

    const existingProduct = products.find((product) => product.id === id);

    const updatedData = {
      ...updates,

      slug: updates.slug
        ? slugify(updates.slug)
        : existingProduct?.slug || slugify(updates.name || ""),

      seoSlug: updates.seoSlug
        ? slugify(updates.seoSlug)
        : existingProduct?.seoSlug ||
          existingProduct?.slug ||
          slugify(updates.name || ""),

      seoTitle: updates.seoTitle || existingProduct?.seoTitle || updates.name,

      seoDescription:
        updates.seoDescription ?? existingProduct?.seoDescription ?? "",

      updatedAt: serverTimestamp(),
    };

    await updateDoc(productRef, updatedData);

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updatedData,
            }
          : product,
      ),
    );
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));

    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductById = (id) => products.find((product) => product.id === id);

  const getProductBySlug = (slug) =>
    products.find(
      (product) => product.slug === slug || product.seoSlug === slug,
    );

  // ---------------- Categories ----------------

  const addCategory = async (category) => {
    const maxOrder = categories.reduce(
      (max, item) => Math.max(max, Number(item.sortOrder) || 0),
      -1,
    );

    const newCategory = {
      ...category,

      slug: category.slug ? slugify(category.slug) : slugify(category.name),

      sortOrder: maxOrder + 1,

      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "categories"), newCategory);

    const savedCategory = {
      id: ref.id,
      ...newCategory,
    };

    setCategories((prev) => [...prev, savedCategory]);

    return savedCategory;
  };

  const updateCategory = async (id, updates) => {
    await updateDoc(doc(db, "categories", id), updates);

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? {
              ...category,
              ...updates,
            }
          : category,
      ),
    );
  };

  // إعادة ترتيب التصنيفات وحفظ الترتيب الجديد في Firebase
  const reorderCategories = async (orderedCategories) => {
    const previousCategories = categories;

    // تحديث الواجهة مباشرة لتكون الاستجابة أسرع
    const updatedCategories = orderedCategories.map((category, index) => ({
      ...category,
      sortOrder: index,
    }));

    setCategories(updatedCategories);

    try {
      await Promise.all(
        updatedCategories.map((category) =>
          updateDoc(doc(db, "categories", category.id), {
            sortOrder: category.sortOrder,
          }),
        ),
      );
    } catch (error) {
      console.error("Category reorder error:", error);

      // استعادة الترتيب السابق إذا فشل الحفظ
      setCategories(previousCategories);

      throw error;
    }
  };

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));

    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  // ---------------- Context Value ----------------

  const value = {
    products,
    categories,
    loading,

    addProduct,
    updateProduct,
    deleteProduct,

    getProductById,
    getProductBySlug,

    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
