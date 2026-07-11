import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  deleteDoc,
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

  // جلب الطلبات
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setOrders(data);
      },
      (error) => {
        console.error("Orders Firebase Error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "oshbah_my_order_numbers",
      JSON.stringify(myOrderNumbers),
    );
  }, [myOrderNumbers]);

  // إنشاء طلب
  const createOrder = async ({ customer, items, total }) => {
    const nextNumber =
      orders.length > 0
        ? Math.max(
            ...orders.map(
              (o) => Number(o.orderNumber?.replace("ORD-", "")) || 0,
            ),
          ) + 1
        : 1001;

    const newOrder = {
      orderNumber: `ORD-${nextNumber}`,

      date: new Date().toISOString(),

      status: "pending",

      history: [
        {
          status: "pending",
          date: new Date().toISOString(),
        },
      ],

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

    setMyOrderNumbers((prev) => [savedOrder.orderNumber, ...prev]);

    return savedOrder;
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (id, status) => {
    const order = orders.find((o) => o.id === id);

    if (!order) return;

    // خصم المخزون عند اكتمال الطلب
    if (status === "completed" && order.status !== "completed") {
      for (const item of order.items) {
        const productRef = doc(db, "products", item.id);

        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const product = productSnap.data();

          const currentStock = Number(product.stock || 0);

          const newStock = Math.max(0, currentStock - Number(item.quantity));

          await updateDoc(productRef, {
            stock: newStock,
            updatedAt: serverTimestamp(),
          });
        }
      }
    }

    const newHistory = [
      ...(order.history || []),

      {
        status,

        date: new Date().toISOString(),
      },
    ];

    await updateDoc(doc(db, "orders", id), {
      status,

      history: newHistory,
    });
  };

  // حذف طلب
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));

    setOrders((prev) => prev.filter((order) => order.id !== id));

    setMyOrderNumbers((prev) =>
      prev.filter((number) => {
        const order = orders.find((o) => o.id === id);

        return number !== order?.orderNumber;
      }),
    );
  };

  // جلب طلب بالرقم
  const getOrderByNumber = (orderNumber) =>
    orders.find((order) => order.orderNumber === orderNumber);

  // جلب طلب بالمعرف
  const getOrderById = (id) => orders.find((order) => order.id === id);

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

    .reduce(
      (sum, order) => sum + Number(order.total || 0),

      0,
    );

  const value = {
    orders,

    myOrders,

    createOrder,

    updateOrderStatus,

    deleteOrder,

    getOrderByNumber,

    getOrderById,

    findOrder,

    totalRevenue,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}
