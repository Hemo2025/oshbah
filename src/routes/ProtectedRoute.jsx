import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // ننتظر Firebase حتى يتحقق من حالة الجلسة الحالية قبل اتخاذ قرار
  // التحويل، وإلا سيتم تحويل المستخدم المسجّل دخوله فعلًا إلى صفحة
  // الدخول لجزء من الثانية عند كل تحديث للصفحة (F5).
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        جارٍ التحقق من الجلسة...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
