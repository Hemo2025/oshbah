import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const { adminName } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>

        <p className="text-sm text-gray-500">مرحبًا بك في إدارة متجر عشبة 🌿</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
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

          <div>
            <h3 className="font-semibold">{adminName}</h3>

            <p className="text-sm text-gray-500">المدير</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
