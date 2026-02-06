import { createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const value = {
    user: { role: "ADMIN" },
    isAuthenticated: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
