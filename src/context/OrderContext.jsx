import { useEffect, useState } from "react";
import { OrderContext } from "./order-context-instance";

const ORDERS_KEY = "oshbah_orders";
const MY_ORDERS_KEY = "oshbah_my_order_numbers";

function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadMyOrderNumbers() {
  try {
    const raw = localStorage.getItem(MY_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);
  const [myOrderNumbers, setMyOrderNumbers] = useState(loadMyOrderNumbers);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(myOrderNumbers));
  }, [myOrderNumbers]);

  const createOrder = ({ customer, items, total }) => {
    const nextNumber =
      orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1001;

    const newOrder = {
      id: nextNumber,
      orderNumber: `ORD-${nextNumber}`,
      date: new Date().toISOString(),
      status: "pending",
      customer,
      items,
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Remember this order number on this browser so the customer can
    // track it later without needing to log in.
    setMyOrderNumbers((prev) => [newOrder.orderNumber, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const getOrderByNumber = (orderNumber) =>
    orders.find((o) => o.orderNumber === orderNumber);

  // Guest order lookup: match order number + phone number together so a
  // random guess of an order number alone can't reveal someone else's info.
  const findOrder = (orderNumber, phone) => {
    const cleanPhone = phone.trim().replace(/\s/g, "");
    const order = orders.find(
      (o) =>
        o.orderNumber.trim().toLowerCase() ===
          orderNumber.trim().toLowerCase() &&
        o.customer.phone.replace(/\s/g, "") === cleanPhone,
    );
    return order || null;
  };

  // Orders placed from this browser, newest first, joined with live data.
  const myOrders = myOrderNumbers
    .map((num) => orders.find((o) => o.orderNumber === num))
    .filter(Boolean);

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const value = {
    orders,
    myOrders,
    createOrder,
    updateOrderStatus,
    getOrderByNumber,
    findOrder,
    totalRevenue,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
