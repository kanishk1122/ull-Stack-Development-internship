import useAuthStore from "../store/useAuthStore";

export const useAuth = () => {
  const { user, login, logout, isAuthenticated, getUserRole } = useAuthStore();
  const role = getUserRole();
  const isAdmin = role === "ADMIN";
  const isStoreOwner = role === "STORE_OWNER";
  const isUser = role === "USER";

  return {
    user,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    role,
    isAdmin,
    isStoreOwner,
    isUser,
  };
};
