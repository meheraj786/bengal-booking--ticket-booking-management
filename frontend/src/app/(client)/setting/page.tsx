"use client";

import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";
import { authStore } from "@/store/auth.store";

export default function SettingsPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const logout = useLogout();

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[75px] max-md:w-[calc(100%-32px)]">
          <div className="text-center py-12">Loading...</div>
        </section>
      </main>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        authStore.clearUser();
        router.push("/");
      },
    });
  };

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-[min(1180px,calc(100%-48px))] py-[75px] max-md:w-[calc(100%-32px)]">
        <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          ACCOUNT
        </p>
        <h1 className="m-0 text-[clamp(48px,6vw,72px)] font-medium leading-[0.98] tracking-[-4px]">
          Settings
          <br />
          <em>& preferences.</em>
        </h1>

        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <p className="font-medium capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Edit profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleLogout}
                disabled={logout.isPending}
                variant="destructive"
                className="w-full"
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </Button>
              <Button variant="outline" className="w-full">
                Delete account
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
