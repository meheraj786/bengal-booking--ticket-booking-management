"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { useLogin } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import { getDashboardPathForRole } from "@/lib/auth-redirect";

export default function LoginPage() {
  const router = useRouter();
  const mutation = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: (data) => {
        router.push(getDashboardPathForRole(data.user.role));
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
        <p className="eyebrow">WELCOME BACK</p>
        <h1>
          Good to see
          <br />
          <em>you again.</em>
        </h1>
        <p className="auth-intro">Your next great moment is waiting.</p>
        <a className="google-button" href={authService.googleLoginUrl()}>
          G <span>Continue with Google</span>
        </a>
        <div className="or">
          <span>or continue with email</span>
        </div>
        <form id="login-form" onSubmit={handleSubmit}>
          <FieldGroup className="space-y-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email address</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    disabled={mutation.isPending}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {mutation.isError && (
              <p className="auth-error" role="alert">
                {mutation.error.message}
              </p>
            )}
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="login-form"
          className="button auth-button w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signing in..." : "Log in →"}
        </Button>

        <p className="auth-switch">
          New to Evently? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
