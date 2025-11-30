import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { api, getToken, setToken, clearToken } from "../api";

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = getToken();
    return token ? { token } : null;
  });

  // pokud token expiroval nebo je nevalidní → smažeme ho
  useEffect(() => {
    if (!getToken()) setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,

      async login(email, password) {
        const { token } = await api.login(email, password);
        setToken(token);
        setUser({ token });
      },

      async register(name, surename, email, password) {
        await api.register(name, surename, email, password);
      },

      logout() {
        clearToken();
        setUser(null);
      },
    }),
    [user]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
