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
    <main className="min-h-screen bg-[var(--lavender)] px-[5%] py-[38px]">
      <Link
        className="block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>
      <div className="mx-auto mt-[35px] w-full max-w-[460px] bg-[var(--cream)] p-12 text-left max-sm:px-6 max-sm:py-9">
        <p className="mb-[18px] font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)]">
          WELCOME BACK
        </p>
        <h1 className="m-0 text-[47px] font-medium leading-[0.98] tracking-[-4px]">
          Good to see
          <br />
          <em>you again.</em>
        </h1>
        <p className="my-[15px] mb-7 max-w-[300px] font-sans text-[13px] leading-[1.6] text-[var(--muted)]">
          Your next great moment is waiting.
        </p>
        <a
          className="block w-full border border-[var(--line)] bg-white p-[13px] text-center font-sans font-bold text-[#4285f4]"
          href={authService.googleLoginUrl()}
        >
          G <span>Continue with Google</span>
        </a>
        <div className="my-6 flex items-center gap-2.5 font-sans text-[10px] text-[var(--muted)] before:h-px before:flex-1 before:bg-[var(--line)] after:h-px after:flex-1 after:bg-[var(--line)]">
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
              <p className="font-sans text-[11px] text-[#b33e37]" role="alert">
                {mutation.error.message}
              </p>
            )}
          </FieldGroup>
        </form>

        <Button
          type="submit"
          form="login-form"
          className="mt-0 w-full bg-[var(--coral)] font-sans text-xs font-bold text-white hover:bg-[var(--coral-dark)]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Signing in..." : "Log in →"}
        </Button>

        <p className="mt-4 text-center font-sans text-[11px] text-[var(--muted)]">
          New to Bengal Booking? <Link href="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
