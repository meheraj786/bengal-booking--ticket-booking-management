"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b bg-white fixed right-0 left-0 md:left-64 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.image ?? undefined} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
