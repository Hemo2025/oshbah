import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useStore } from "../../hooks/useStore";

function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { categories } = useStore();

  const [searchInput, setSearchInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchInput.trim();

    navigate(
      query
        ? `/products?search=${encodeURIComponent(query)}`
        : "/products",
    );

    closeMenu();
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    closeMenu();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-md shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-2xl text-gray-700 md:hidden"
            aria-label="فتح القائمة"
          >
            <FaBars />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <FaLeaf className="text-3xl text-green-600" />

            <h1 className="text-2xl font-bold text-green-700 sm:text-3xl">
              عُشبة ستور
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 font-medium md:flex">
            <Link to="/" className="transition hover:text-green-600">
              الرئيسية
            </Link>

            <Link
              to="/products"
              className="transition hover:text-green-600"
            >
              المتجر
            </Link>

            <Link
              to="/products"
              className="transition hover:text-green-600"
            >
              التصنيفات
            </Link>

            <a href="#" className="transition hover:text-green-600">
              تواصل معنا
            </a>
          </nav>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center overflow-hidden rounded-full border lg:flex"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-64 px-4 py-2 outline-none"
            />

            <button
              type="submit"
              className="bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
            >
              <FaSearch />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4 text-xl sm:gap-5">
            <Link
              to="/track-order"
              className="hover:text-green-600"
              title="متابعة الطلب"
            >
              <FaUser />
            </Link>

            <Link
              to="/wishlist"
              className="relative hover:text-red-500"
            >
              <FaHeart />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative hover:text-green-600"
            >
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-[10000] md:hidden">
            <div
              onClick={closeMenu}
              className="absolute inset-0 bg-black/50"
            />

            <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2"
                >
                  <FaLeaf className="text-2xl text-green-600" />

                  <span className="text-xl font-bold text-green-700">
                    عُشبة
                  </span>
                </Link>

                <button
                  onClick={closeMenu}
                  className="text-2xl text-gray-500 hover:text-gray-800"
                >
                  <FaTimes />
                </button>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 border-b p-5"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) =>
                    setSearchInput(e.target.value)
                  }
                  placeholder="ابحث عن منتج..."
                  className="flex-1 rounded-xl border p-3 outline-none focus:border-green-600"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-green-600 p-3 text-white"
                >
                  <FaSearch />
                </button>
              </form>

              <nav className="flex flex-col border-b p-3">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 hover:bg-green-50"
                >
                  الرئيسية
                </Link>

                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 hover:bg-green-50"
                >
                  كل المنتجات
                </Link>

                <Link
                  to="/wishlist"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 hover:bg-green-50"
                >
                  المفضلة
                </Link>

                <Link
                  to="/track-order"
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 hover:bg-green-50"
                >
                  متابعة الطلب
                </Link>
              </nav>

              {categories.length > 0 && (
                <div className="p-3">
                  <p className="px-3 py-2 text-sm font-semibold text-gray-400">
                    التصنيفات
                  </p>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        handleCategoryClick(cat.name)
                      }
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-right hover:bg-green-50"
                    >
                      {cat.name}

                      <FaChevronLeft className="text-xs text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* مساحة حتى لا يغطي الهيدر المحتوى */}
      <div className="h-[88px]" />
    </>
  );
}

export default Header;