import { createContext, useContext, useState, useMemo } from 'react';
import { api, setToken, getToken } from '../api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? { token: getToken() } : null));

  const value = useMemo(() => ({
    user,
    async login(email, password) {
      const { token } = await api.login(email, password);
      setToken(token); setUser({ token });
    },
    async register(name, surename, email, password) {
      await api.register(name, surename, email, password);
    },
    logout() {
      localStorage.removeItem('token'); setUser(null);
    }
  }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
