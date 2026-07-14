import { useEffect, useState } from "react";
import { CartContext } from "./cart-context-instance";
import { useStore } from "../hooks/useStore";

const CART_KEY = "oshbah_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// cartLines shape: [{ productId, quantity }]
export function CartProvider({ children }) {
  const { products } = useStore();
  const [cartLines, setCartLines] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartLines));
  }, [cartLines]);

  const addToCart = (product, quantity = 1) => {
    window.dispatchEvent(
      new CustomEvent("cart-animation", {
        detail: {
          quantity,
        },
      }),
    );
    setCartLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);

      if (existing) {
        return prev.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }

      return [...prev, { productId: product.id, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartLines((prev) => prev.filter((line) => line.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartLines((prev) =>
      prev.map((line) =>
        line.productId === productId ? { ...line, quantity } : line,
      ),
    );
  };

  const clearCart = () => setCartLines([]);

  // Join cart lines with live product data (drops lines whose product was deleted)
  const cartItems = cartLines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return null;
      return { ...product, quantity: line.quantity };
    })
    .filter(Boolean);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
