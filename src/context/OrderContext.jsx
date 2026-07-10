import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { OrderContext } from "./order-context-instance";

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [myOrderNumbers, setMyOrderNumbers] = useState(() => {
    try {
      const saved = localStorage.getItem("oshbah_my_order_numbers");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // جلب الطلبات من Firebase
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "orders"));

        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setOrders(data);
      } catch (error) {
        console.error("Orders Firebase Error:", error);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "oshbah_my_order_numbers",
      JSON.stringify(myOrderNumbers),
    );
  }, [myOrderNumbers]);

  // إنشاء طلب جديد
  const createOrder = async ({ customer, items, total }) => {
    const nextNumber =
      orders.length > 0
        ? Math.max(
            ...orders.map((o) => Number(o.orderNumber?.replace("ORD-", ""))),
          ) + 1
        : 1001;

    const newOrder = {
      orderNumber: `ORD-${nextNumber}`,

      date: new Date().toISOString(),

      status: "pending",

      customer,

      items,

      total,

      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "orders"), newOrder);

    const savedOrder = {
      id: ref.id,
      ...newOrder,
    };

    setOrders((prev) => [savedOrder, ...prev]);

    setMyOrderNumbers((prev) => [savedOrder.orderNumber, ...prev]);

    return savedOrder;
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status,
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );
  };

  const getOrderByNumber = (orderNumber) =>
    orders.find((order) => order.orderNumber === orderNumber);

  const findOrder = (orderNumber, phone) => {
    const cleanPhone = phone.trim().replace(/\s/g, "");

    const order = orders.find(
      (o) =>
        o.orderNumber?.trim().toLowerCase() ===
          orderNumber.trim().toLowerCase() &&
        o.customer.phone.replace(/\s/g, "") === cleanPhone,
    );

    return order || null;
  };

  const myOrders = myOrderNumbers
    .map((number) => orders.find((order) => order.orderNumber === number))
    .filter(Boolean);

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

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
