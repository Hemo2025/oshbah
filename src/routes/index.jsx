import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

// Store Pages
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProductDetails from "../pages/ProductDetails";
import Products from "../pages/Products";
import Wishlist from "../pages/Wishlist";
import OrderConfirmation from "../pages/OrderConfirmation";
import TrackOrder from "../pages/TrackOrder";
import NotFound from "../pages/NotFound";
import CategoriesPage from "../pages/CategoriesPage";

// Admin Pages
import Login from "../admin/Login";
import Dashboard from "../admin/Dashboard";
import AdminProducts from "../admin/Products";
import AdminCategories from "../admin/Categories";
import AdminOrders from "../admin/Orders";
import AdminSettings from "../admin/Settings";
import ProductForm from "../admin/ProductForm";
import ProtectedRoute from "./ProtectedRoute";
import OrderDetails from "../admin/OrderDetails";
import About from "../pages/About";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order-confirmation/:orderNumber",
        element: <OrderConfirmation />,
      },
      {
        path: "track-order",
        element: <TrackOrder />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
    ],
  },

  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "add-product",
            element: <ProductForm />,
          },
          {
            path: "edit-product/:id",
            element: <ProductForm />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "orders/:id",
            element: <OrderDetails />,
          },
          {
            path: "settings",
            element: <AdminSettings />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
