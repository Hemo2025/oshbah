import { useEffect, useState } from "react";
import initialProducts from "../data/products";
import initialCategories from "../data/categories";
import { StoreContext } from "./store-context-instance";

const PRODUCTS_KEY = "oshbah_products";
const CATEGORIES_KEY = "oshbah_categories";

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function slugify(text) {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, "");
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() =>
    loadFromStorage(PRODUCTS_KEY, initialProducts),
  );
  const [categories, setCategories] = useState(() =>
    loadFromStorage(CATEGORIES_KEY, initialCategories),
  );

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  // ---------- Products CRUD ----------
  const addProduct = (product) => {
    const nextId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: nextId,
      slug: product.slug ? slugify(product.slug) : slugify(product.name),
      rating: 5,
      reviews: 0,
      images: [],
      ingredients: [],
      ...product,
    };

    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id) =>
    products.find((p) => String(p.id) === String(id));

  const getProductBySlug = (slug) => products.find((p) => p.slug === slug);

  // ---------- Categories CRUD ----------
  const addCategory = (category) => {
    const nextId =
      categories.length > 0
        ? Math.max(...categories.map((c) => c.id)) + 1
        : 1;

    const newCategory = {
      id: nextId,
      slug: category.slug ? slugify(category.slug) : slugify(category.name),
      image: "",
      ...category,
    };

    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id, updates) => {
    const oldCategory = categories.find((c) => c.id === id);

    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );

    // Keep products in sync if the category name changes
    if (oldCategory && updates.name && updates.name !== oldCategory.name) {
      setProducts((prev) =>
        prev.map((p) =>
          p.category === oldCategory.name
            ? { ...p, category: updates.name }
            : p,
        ),
      );
    }
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const value = {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductBySlug,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
