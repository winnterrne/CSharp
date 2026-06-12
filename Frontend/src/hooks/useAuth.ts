import { authStore } from "../store/authStore";

export const useAuth = () => {
  const user = authStore((state) => state.user);
  const token = authStore((state) => state.token);
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const isLoading = authStore((state) => state.isLoading);

  const login = authStore((state) => state.login);
  const logout = authStore((state) => state.logout);
  const setUser = authStore((state) => state.setUser);
  const setToken = authStore((state) => state.setToken);
  const setLoading = authStore((state) => state.setLoading);
  const clear = authStore((state) => state.clear);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    setToken,
    setLoading,
    clear,
  };
};