import { FaBell, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function Header({ onMenuClick }) {
  const { adminName } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm lg:p-5">
      <div className="flex items-center gap-3">
        {/* زر القائمة في الجوال */}
        <button
          onClick={onMenuClick}
          className="rounded-xl bg-gray-100 p-3 lg:hidden"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800 lg:text-2xl">
            لوحة التحكم
          </h1>

          <p className="hidden text-sm text-gray-500 sm:block">
            مرحبًا بك في إدارة متجر عشبة 🌿
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* البحث يختفي في الجوال */}
        <div className="relative hidden xl:block">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="ابحث..."
            className="w-72 rounded-xl border py-2 pl-10 pr-4 outline-none focus:border-green-600"
          />
        </div>

        <button className="relative rounded-xl bg-gray-100 p-3 hover:bg-gray-200">
          <FaBell />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-4xl text-green-700" />

          <div className="hidden md:block">
            <h3 className="font-semibold">{adminName}</h3>

            <p className="text-sm text-gray-500">المدير</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
