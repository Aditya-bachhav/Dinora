import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { superAdminApi, getSuperAdminToken, setSuperAdminToken, clearSuperAdminToken } from "../services/api";

const SuperAdminAuthContext = createContext(null);

export function SuperAdminAuthProvider({ children }) {
  const [token, setTokenState] = useState(getSuperAdminToken());
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!getSuperAdminToken()) {
      setSuperAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const me = await superAdminApi.me();
      setSuperAdmin(me);
    } catch {
      setSuperAdmin(null);
      setTokenState("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (email, password) => {
    const result = await superAdminApi.login(email, password);
    setSuperAdminToken(result.token);
    setTokenState(result.token);
    setSuperAdmin(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearSuperAdminToken();
    setTokenState("");
    setSuperAdmin(null);
  }, []);

  const value = {
    token,
    superAdmin,
    isAuthenticated: Boolean(token && superAdmin),
    loading,
    login,
    logout,
  };

  return <SuperAdminAuthContext.Provider value={value}>{children}</SuperAdminAuthContext.Provider>;
}

export function useSuperAdminAuth() {
  const ctx = useContext(SuperAdminAuthContext);
  if (!ctx) throw new Error("useSuperAdminAuth must be used inside SuperAdminAuthProvider");
  return ctx;
}
