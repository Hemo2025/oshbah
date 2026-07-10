import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context-instance";

const AUTH_KEY = "oshbah_admin_session";

// TEMPORARY local credentials until this is connected to Firebase Auth.
// Change these, or ask to move them somewhere safer, before going live.
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

function loadSession() {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(loadSession);
  const [adminName, setAdminName] = useState(() => {
    try {
      return localStorage.getItem("oshbah_admin_name") || "المدير";
    } catch {
      return "المدير";
    }
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (username, password) => {
    const trimmedUser = username.trim();

    if (
      trimmedUser === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setAdminName(trimmedUser);
      localStorage.setItem("oshbah_admin_name", trimmedUser);
      return { success: true };
    }

    return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة." };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, adminName, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
