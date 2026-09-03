import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, getAdminToken, setAdminToken, clearAdminToken } from "../services/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setTokenState] = useState(getAdminToken());
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!getAdminToken()) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setAdmin(me);
    } catch {
      // Token invalid/expired — api.js already cleared it on a 401.
      setAdmin(null);
      setTokenState("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    setAdminToken(result.token);
    setTokenState(result.token);
    setAdmin(result.user);
    return result;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const result = await authApi.register(name, email, password);
    setAdminToken(result.token);
    setTokenState(result.token);
    setAdmin(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setTokenState("");
    setAdmin(null);
  }, []);

  const value = {
    token,
    admin,
    isAuthenticated: Boolean(token && admin),
    loading,
    login,
    register,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
