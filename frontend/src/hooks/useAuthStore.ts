import { useEffect, useState } from "react";
import { useCurrentUser } from "./use-auth";
import { authStore } from "@/store/auth.store";
import type { CurrentUser } from "@/types/auth.types";

export function useAuthStore() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: fetchedUser, isLoading: isFetching } = useCurrentUser();

  useEffect(() => {
    if (isFetching) return;

    if (fetchedUser) {
      authStore.setUser(fetchedUser);
      setUser(fetchedUser);
    } else {
      const storedUser = authStore.getUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, [fetchedUser, isFetching]);

  return { user, isLoading };
}