import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "STORE_OWNER" | "ADMIN";
  token: string;
};

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getUserRole: () => string | null;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        // Also remove from localStorage if persist is used
        localStorage.removeItem("auth-storage");
      },
      isAuthenticated: () => !!get().user,
      getUserRole: () => get().user?.role || null,
    }),
    {
      name: "auth-storage", // unique name
    }
  )
);

export default useAuthStore;
