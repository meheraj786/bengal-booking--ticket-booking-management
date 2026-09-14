"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { useRegister } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.3C29.4 34.9 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.9 39.7 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.4 5.8l6.5 5.3C39.5 37.4 44 31.6 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const mutation = useRegister();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "" },
  });

  const handleSubmit = form.handleSubmit((values) =>
    mutation.mutate(
      { ...values, role: "USER" },
      {
        onSuccess: () =>
          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`,
          ),
      },
    ),
  );

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--lavender)] px-[5%] py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[var(--coral)]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[var(--coral-dark)]/10 blur-3xl" />
      </div>

      <Link
        className="relative z-10 block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>

      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-[460px] gap-0 border-none bg-[var(--cream)]/95 py-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur">
          <CardHeader className="gap-0 px-8 pt-10 pb-2 sm:px-12">
            <Badge
              variant="secondary"
              className="mb-4 w-fit rounded-full bg-[var(--coral-dark)]/10 px-3 py-1 font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)] hover:bg-[var(--coral-dark)]/10"
            >
              JOIN THE COMMUNITY
            </Badge>
            <h1 className="m-0 text-[42px] font-medium leading-[0.98] tracking-[-3px] sm:text-[47px] sm:tracking-[-4px]">
              Make room for
              <br />
              <em>more moments.</em>
            </h1>
            <p className="my-[15px] mb-2 max-w-[320px] font-sans text-[13px] leading-[1.6] text-gray-500">
              Create an account and start finding things worth showing up for.
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-10 sm:px-12">
            <a
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white p-[13px] text-center font-sans text-[13px] font-bold text-[#4285f4] shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              href={authService.googleLoginUrl()}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </a>

            <div className="my-6 flex items-center gap-3">
              <Separator className="flex-1 bg-[var(--line)]" />
              <span className="font-sans text-[10px] tracking-wide text-gray-500">
                or sign up with email
              </span>
              <Separator className="flex-1 bg-[var(--line)]" />
            </div>

            <form id="register-form" onSubmit={handleSubmit}>
              <FieldGroup className="space-y-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-name">Your name</FieldLabel>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          {...field}
                          id="register-name"
                          placeholder="How should we call you?"
                          disabled={mutation.isPending}
                          aria-invalid={fieldState.invalid}
                          className="pl-9"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-email">
                        Email address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          {...field}
                          id="register-email"
                          type="email"
                          placeholder="you@example.com"
                          disabled={mutation.isPending}
                          aria-invalid={fieldState.invalid}
                          className="pl-9"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="register-phone">
                        Phone (optional)
                      </FieldLabel>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          {...field}
                          id="register-phone"
                          placeholder="+880..."
                          disabled={mutation.isPending}
                          aria-invalid={fieldState.invalid}
                          className="pl-9"
                        />
                      </div>
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
                      <FieldLabel htmlFor="register-password">
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          {...field}
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          disabled={mutation.isPending}
                          aria-invalid={fieldState.invalid}
                          className="pl-9 pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {mutation.isSuccess && (
                  <Alert className="border-[#388d67]/30 bg-[#388d67]/5 text-[#388d67]">
                    <CheckCircle2 className="h-4 w-4 !text-[#388d67]" />
                    <AlertDescription className="font-sans text-[11px] text-[#388d67]">
                      Check your email to verify your account.
                    </AlertDescription>
                  </Alert>
                )}

                {mutation.isError && (
                  <Alert
                    variant="destructive"
                    className="border-[#b33e37]/30 bg-[#b33e37]/5 text-[#b33e37]"
                  >
                    <AlertDescription className="font-sans text-[11px]">
                      {mutation.error.message}
                    </AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
            </form>

            <Button
              type="submit"
              form="register-form"
              className="mt-6 w-full gap-2 bg-[var(--coral)] font-sans text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--coral-dark)] hover:shadow-md"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="mt-5 text-center font-sans text-[11px] text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[var(--coral-dark)] underline-offset-2 hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
