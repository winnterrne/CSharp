import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { authStore } from "../store/authStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(authStore.getUser());
  const [token, setToken] = useState<string | null>(authStore.getToken());

  const login = (newToken: string, newUser: User) => {
    authStore.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    authStore.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
