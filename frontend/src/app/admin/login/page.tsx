"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { useLogin, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const mutation = useLogin();
  const logout = useLogout();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        if (data.user.role !== "SUPER_ADMIN") {
          logout.mutate();
          form.setError("root", {
            message: "You are not authorized to access the admin panel.",
          });
          return;
        }
        router.replace("/admin");
        router.refresh();
      },
    });
  });

  return (
    <main className="auth-shell bg-red-500">
      <div className="auth-card">
        <p className="eyebrow">ADMIN ACCESS</p>
        <h1>
          Evently
          <br />
          <em>Control Room.</em>
        </h1>
        <p className="auth-intro">
          Restricted area. Authorized personnel only.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit(event);
          }}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@evently.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="form-error">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="form-error">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          {(mutation.isError || form.formState.errors.root) && (
            <p className="auth-error" role="alert">
              {form.formState.errors.root?.message ?? mutation.error?.message}
            </p>
          )}
          <Button
            type="submit"
            className="button auth-button w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in..." : "Log in →"}
          </Button>
        </form>
      </div>
    </main>
  );
}
