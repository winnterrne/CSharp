import { useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { authStore } from "../store/authStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Subscribe to authStore changes
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const isLoading = authStore((state) => state.isLoading);
  const setUser = authStore((state) => state.setUser);
  const setToken = authStore((state) => state.setToken);
  const setLoading = authStore((state) => state.setLoading);
  const logout = authStore((state) => state.logout);

  // Restore auth state from storage on mount
  useEffect(() => {
    const storedUser = authStore.getState().user;
    const storedToken = authStore.getState().token;
    if (!storedUser || !storedToken) {
      logout();
    }
  }, [logout]);

  const login = (newUser: User, newToken: string) => {
    authStore.getState().login(newUser, newToken);
  };

  const handleLogout = () => {
    authStore.getState().logout();
  };

  const handleSetLoading = (loading: boolean) => {
    authStore.getState().setLoading(loading);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout: handleLogout,
        setLoading: handleSetLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};