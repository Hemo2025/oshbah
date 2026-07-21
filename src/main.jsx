import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <SettingsProvider>
          <StoreProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <App />
                  <Analytics />
                  <ToastContainer position="top-left" rtl autoClose={5000} />
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </StoreProvider>
        </SettingsProvider>
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>,
);
