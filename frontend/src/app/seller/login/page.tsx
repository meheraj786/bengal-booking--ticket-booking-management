"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { useLogin, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SellerLoginPage() {
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
        if (data.user.role !== "SELLER") {
          logout.mutate();
          form.setError("root", {
            message: "This account is not registered as a seller.",
          });
          return;
        }
        router.push("/seller/dashboard");
        router.refresh();
      },
    });
  });

  return (
    <main className="auth-shell">
      <Link className="brand" href="/">
        evently<span>.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">SELLER LOGIN</p>
        <h1>
          Manage your
          <br />
          <em>events.</em>
        </h1>
        <p className="auth-intro">Log in to your seller dashboard.</p>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
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
        <p className="auth-switch">
          New seller?{" "}
          <Link href="/seller/register">Create a seller account</Link>
        </p>
      </div>
    </main>
  );
}
