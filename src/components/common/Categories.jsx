import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { useStore } from "../../hooks/useStore";

function Categories() {
  const { categories } = useStore();

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
          تصنيفات متجر عُشبة 🌿
        </h2>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد تصنيفات بعد.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => (
              <Link
                to={`/products?category=${encodeURIComponent(item.name)}`}
                key={item.id}
                className="
                  block
                  rounded-3xl
                  border
                  bg-green-50
                  p-10
                  text-center
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-2
                  hover:shadow-xl
                "
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mx-auto mb-6 h-20 w-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="mb-6 flex justify-center text-6xl text-green-600">
                    <FaLeaf />
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-700">
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
