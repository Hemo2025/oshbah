import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/config";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setReviews(data);
    });

    return () => unsubscribe();
  }, []);

  const approveReview = async (id) => {
    try {
      await updateDoc(doc(db, "reviews", id), {
        approved: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeReview = async (id) => {
    if (!window.confirm("حذف التقييم؟")) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h1 className="mb-6 text-3xl font-bold">إدارة التقييمات</h1>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
              لا توجد تقييمات حالياً
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border bg-white p-5 transition hover:shadow-lg"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{review.name}</h3>

                      <p className="text-sm text-gray-500">
                        ⭐ {review.rating}/5
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        review.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.approved ? "معتمد" : "بانتظار المراجعة"}
                    </span>
                  </div>

                  <p className="mb-5 leading-8 text-gray-700">
                    {review.comment}
                  </p>

                  <div className="flex gap-3">
                    {!review.approved && (
                      <button
                        onClick={() => approveReview(review.id)}
                        className="rounded-xl bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
                      >
                        اعتماد
                      </button>
                    )}

                    <button
                      onClick={() => removeReview(review.id)}
                      className="rounded-xl bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reviews;
