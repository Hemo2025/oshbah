import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/admin/dashboard";

  if (!authLoading && isAuthenticated) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-700 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center text-5xl text-green-600">
            <FaLeaf />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            لوحة تحكم متجر عُشبة
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            سجّل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-100 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                placeholder="admin@oshbah.com"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700">
              كلمة المرور
            </label>
            <div className="relative">
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border py-3 pr-11 pl-4 outline-none focus:border-green-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
          >
            {submitting ? "جارِ التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
