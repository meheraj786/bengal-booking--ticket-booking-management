import type { CurrentUser } from "@/types/auth.types";

const USER_STORAGE_KEY = "evently_user";

export const authStore = {
  getUser: (): CurrentUser | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setUser: (user: CurrentUser | null) => {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  clearUser: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
