import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if already logged in
  useEffect(() => {
    api
      .get("auth/me/")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    // 1️⃣ Get CSRF
    await api.get("auth/csrf/");

    // 2️⃣ Login
    const res = await api.post("auth/login/", {
      email,
      password,
    });

    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await api.post("auth/logout/");
    setUser(null);
  };
  function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
