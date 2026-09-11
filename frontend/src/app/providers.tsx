"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-auth";
import { authStore } from "@/store/auth.store";

function AuthSync({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      authStore.setUser(user);
    }
  }, [user]);

  return children;
}

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync>{children}</AuthSync>
    </QueryClientProvider>
  );
}
