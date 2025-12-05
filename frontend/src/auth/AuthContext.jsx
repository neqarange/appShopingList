import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { api, getToken, setToken, clearToken } from "../api";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = getToken();
    const saved = localStorage.getItem("user");
    return token && saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { token, user } = await api.login(email, password);

    setToken(token);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    clearToken();
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
