import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { api, getToken, setToken, clearToken } from "../api";

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const { token, user } = await api.login(email, password);

    if (!token || !user) throw new Error("Invalid login response");

    setToken(token);

    const formattedUser = {
      _id: user._id,
      email: user.email,
      name: user.name || "",
      surename: user.surename || "",
    };

    setUser(formattedUser);
    localStorage.setItem("user", JSON.stringify(formattedUser));
  };

  // REGISTER ✅
  const register = async (name, surename, email, password) => {
    await api.register(name, surename, email, password);
  };

  // LOGOUT
  const logout = () => {
    clearToken();
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}



