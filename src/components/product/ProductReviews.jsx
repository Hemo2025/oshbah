import { useReviews } from "../../hooks/useReviews";
import { FaStar, FaUserCircle, FaCalendarAlt } from "react-icons/fa";
function ProductReviews({ productId }) {
  const { reviews, loading } = useReviews(productId);

  if (loading) {
    return (
      <div className="mt-12 rounded-3xl bg-white p-8 shadow">
        جاري تحميل التقييمات...
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-3xl bg-white p-8 shadow">
      <h2 className="mb-8 text-3xl font-bold">
        تقييمات العملاء ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">لا توجد تقييمات لهذا المنتج بعد.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-none">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-3xl text-green-600" />

                  <div>
                    <h3 className="font-bold text-gray-800">{review.name}</h3>

                    <p className="text-xs text-gray-400">عميل موثق</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating ? "text-yellow-400" : "text-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="leading-8 text-gray-600">{review.comment}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                <FaCalendarAlt />

                <span>
                  {review.createdAt?.toDate?.().toLocaleDateString("ar-SA")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
