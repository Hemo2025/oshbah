import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/config";
import { AuthContext } from "./auth-context-instance";

// ملاحظة أمنية:
// أصبح تسجيل الدخول الآن يعتمد بالكامل على Firebase Authentication.
// لا يوجد أي اسم مستخدم/كلمة مرور مكتوبة داخل الكود بعد الآن.
// لإنشاء حساب المدير: افتح Firebase Console → Authentication →
// Sign-in method → فعّل "Email/Password" → من تبويب Users أضف
// بريد وكلمة مرور المدير يدويًا.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true أثناء تحقّق Firebase من حالة الجلسة عند أول تحميل للصفحة
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (err) {
      // رسالة عامة لعدم كشف تفاصيل تفيد أي محاولة اختراق
      // (مثل: هل البريد موجود أصلاً أم لا)
      return {
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        code: err.code,
      };
    }
  };

  const logout = () => signOut(auth);

  const value = {
    user,
    isAuthenticated: !!user,
    authLoading,
    adminName: user?.email || "المدير",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
