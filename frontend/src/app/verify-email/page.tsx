"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResendVerification, useVerifyEmail } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  MailCheck,
  ArrowRight,
} from "lucide-react";

type VerificationState =
  | "idle"
  | "verifying"
  | "success"
  | "error"
  | "missing-token";

function AuthShellBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--coral)]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[var(--coral-dark)]/10 blur-3xl" />
    </div>
  );
}

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-center">
      <Input
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        maxLength={6}
        inputMode="numeric"
        placeholder="000000"
        disabled={disabled}
        className="h-12 w-full max-w-[220px] rounded-xl border border-slate-200 bg-white text-center text-xl tracking-[0.4em] font-semibold shadow-sm"
      />
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState(token ?? "");
  const [resendMessage, setResendMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (token) {
      setState("verifying");
      verifyEmail.mutate(token, {
        onSuccess: (data) => {
          setMessage(data.message);
          setState("success");
        },
        onError: (error) => {
          setMessage(error.message);
          setState("error");
        },
      });
    }
  }, [token, verifyEmail]);

  const submitOtp = (value: string = otp) => {
    if (!/^\d{6}$/.test(value)) {
      setMessage("Enter the 6-digit OTP from your email.");
      setState("error");
      return;
    }
    setState("verifying");
    verifyEmail.mutate(value, {
      onSuccess: (data) => {
        setMessage(data.message);
        setState("success");
      },
      onError: (error) => {
        setMessage(error.message);
        setState("error");
      },
    });
  };

  const resendOtp = () => {
    setResendMessage("");
    resendVerification.mutate(undefined, {
      onSuccess: (data) => setResendMessage(data.message),
      onError: (error) => setResendMessage(error.message),
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--lavender)] px-[5%] py-10">
      <AuthShellBackground />

      <Link
        className="relative z-10 block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>

      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-[460px] gap-0 border-none bg-[var(--cream)]/95 py-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur">
          <CardHeader className="gap-0 px-8 pt-10 pb-2 text-center sm:px-12">
            <Badge
              variant="secondary"
              className="mx-auto mb-4 w-fit rounded-full bg-[var(--coral-dark)]/10 px-3 py-1 font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)] hover:bg-[var(--coral-dark)]/10"
            >
              EMAIL VERIFICATION
            </Badge>
          </CardHeader>

          <CardContent className="px-8 pb-10 text-center sm:px-12">
            {(state === "idle" || state === "missing-token") && (
              <>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--coral)]/10">
                  <MailCheck className="h-7 w-7 text-[var(--coral-dark)]" />
                </div>
                <h1 className="m-0 text-[34px] font-medium leading-[1] tracking-[-2px]">
                  Verify your <em>email</em>
                </h1>
                <p className="mx-auto my-[15px] max-w-[300px] font-sans text-[13px] leading-[1.6] text-gray-500">
                  Enter the 6-digit OTP sent to your email.
                </p>

                <OtpInput
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={verifyEmail.isPending}
                />

                <Button
                  className="mt-6 w-full gap-2 bg-[var(--coral)] font-sans text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--coral-dark)] hover:shadow-md"
                  onClick={() => submitOtp()}
                  disabled={verifyEmail.isPending}
                >
                  {verifyEmail.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify email
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="mt-2 w-full font-sans text-xs font-bold"
                  onClick={resendOtp}
                  disabled={resendVerification.isPending}
                >
                  {resendVerification.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>

                {resendMessage && (
                  <p
                    className="mt-3 font-sans text-[11px] text-gray-500"
                    role="status"
                  >
                    {resendMessage}
                  </p>
                )}

                {state === "missing-token" && (
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-4 w-full font-sans text-xs font-bold text-gray-500"
                  >
                    <Link href="/register">Back to register</Link>
                  </Button>
                )}
              </>
            )}

            {state === "verifying" && (
              <>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--coral)]/10">
                  <Loader2 className="h-7 w-7 animate-spin text-[var(--coral-dark)]" />
                </div>
                <h1 className="m-0 text-[34px] font-medium leading-[1] tracking-[-2px]">
                  Verifying your <em>email...</em>
                </h1>
                <p className="mx-auto my-[15px] max-w-[280px] font-sans text-[13px] leading-[1.6] text-gray-500">
                  Hang tight, this only takes a moment.
                </p>
              </>
            )}

            {state === "success" && (
              <>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#388d67]/10">
                  <CheckCircle2 className="h-7 w-7 text-[#388d67]" />
                </div>
                <h1 className="m-0 text-[38px] font-medium leading-[1] tracking-[-3px]">
                  You&apos;re all
                  <br />
                  <em>set.</em>
                </h1>
                <p className="mx-auto my-[15px] max-w-[300px] font-sans text-[13px] leading-[1.6] text-gray-500">
                  {message}
                </p>
                <Button
                  asChild
                  className="mt-4 w-full gap-2 bg-[var(--coral)] font-sans text-xs font-bold text-white shadow-sm transition-all hover:bg-[var(--coral-dark)] hover:shadow-md"
                >
                  <Link href="/explore">
                    Browse events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}

            {state === "error" && (
              <>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#b33e37]/10">
                  <AlertCircle className="h-7 w-7 text-[#b33e37]" />
                </div>
                <h1 className="m-0 text-[32px] font-medium leading-[1] tracking-[-2px]">
                  Verification <em>failed</em>
                </h1>

                <Alert
                  variant="destructive"
                  className="mt-4 border-[#b33e37]/30 bg-[#b33e37]/5 text-left text-[#b33e37]"
                >
                  <AlertDescription className="font-sans text-[11px]">
                    {message}
                  </AlertDescription>
                </Alert>

                <OtpInput
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={verifyEmail.isPending}
                />

                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    className="w-full gap-2 bg-[var(--coral)] font-sans text-xs font-bold text-white hover:bg-[var(--coral-dark)]"
                    onClick={() => submitOtp()}
                    disabled={verifyEmail.isPending}
                  >
                    {verifyEmail.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Try again"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-sans text-xs font-bold"
                    onClick={resendOtp}
                    disabled={resendVerification.isPending}
                  >
                    {resendVerification.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </Button>
                  {resendMessage && (
                    <p className="font-sans text-[11px] text-gray-500">
                      {resendMessage}
                    </p>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full font-sans text-xs font-bold text-gray-500"
                  >
                    <Link href="/register">Create a new account</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full font-sans text-xs font-bold text-gray-500"
                  >
                    <Link href="/login">Try logging in</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function VerifyEmailFallback() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--lavender)] px-[5%] py-10">
      <AuthShellBackground />
      <Link
        className="relative z-10 block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>
      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-[460px] gap-0 border-none bg-[var(--cream)]/95 py-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur">
          <CardHeader className="gap-0 px-8 pt-10 pb-2 text-center sm:px-12">
            <Badge
              variant="secondary"
              className="mx-auto mb-4 w-fit rounded-full bg-[var(--coral-dark)]/10 px-3 py-1 font-sans text-[10px] font-bold tracking-[2.2px] text-[var(--coral-dark)] hover:bg-[var(--coral-dark)]/10"
            >
              EMAIL VERIFICATION
            </Badge>
          </CardHeader>
          <CardContent className="px-8 pb-10 text-center sm:px-12">
            <h1 className="m-0 text-[32px] font-medium leading-[1] tracking-[-2px]">
              Loading...
            </h1>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--coral-dark)]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
