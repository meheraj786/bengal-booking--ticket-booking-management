"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResendVerification, useVerifyEmail } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";

type VerificationState =
  | "idle"
  | "verifying"
  | "success"
  | "error"
  | "missing-token";

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
        onSuccess: (data) => { setMessage(data.message); setState("success"); },
        onError: (error) => { setMessage(error.message); setState("error"); },
      });
    }
  }, [token, verifyEmail]);

  const submitOtp = () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessage("Enter the 6-digit OTP from your email.");
      setState("error");
      return;
    }
    setState("verifying");
    verifyEmail.mutate(otp, {
      onSuccess: (data) => { setMessage(data.message); setState("success"); },
      onError: (error) => { setMessage(error.message); setState("error"); },
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
    <main className="auth-shell">
      <Link
        className="block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span className="text-primary">.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">EMAIL VERIFICATION</p>

        {state === "idle" && (
          <>
            <h1>Verify your email</h1>
            <p className="auth-intro">Enter the 6-digit OTP sent to your email.</p>
            <input className="mt-6 w-full rounded border p-3 text-center text-2xl tracking-[0.5em]" maxLength={6} inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" />
            <Button className="mt-4 w-full" onClick={submitOtp}>Verify email</Button>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={resendOtp}
              disabled={resendVerification.isPending}
            >
              {resendVerification.isPending ? "Sending..." : "Resend OTP"}
            </Button>
            {resendMessage && (
              <p className="mt-3 text-center text-sm text-slate-600" role="status">
                {resendMessage}
              </p>
            )}
          </>
        )}

        {state === "verifying" && (
          <>
            <h1>Verifying your email...</h1>
            <p className="auth-intro">Hang tight, this only takes a moment.</p>
            <div className="flex justify-center mt-6">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1>
              You&apos;re all
              <br />
              <em>set.</em>
            </h1>
            <p className="auth-intro">{message}</p>
            <Button
              asChild
              className="mt-4 w-full bg-[var(--coral)] font-sans text-xs font-bold text-white hover:bg-[var(--coral-dark)]"
            >
              <Link href="/explore">Browse events →</Link>
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1>Verification failed</h1>
            <p className="auth-error" role="alert">
              {message}
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Create a new account</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/login">Try logging in</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={resendOtp} disabled={resendVerification.isPending}>
                {resendVerification.isPending ? "Sending..." : "Resend OTP"}
              </Button>
              {resendMessage && <p className="text-center text-sm text-slate-600">{resendMessage}</p>}
            </div>
          </>
        )}

        {state === "missing-token" && (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
            <h1>Verify your email</h1>
            <p className="auth-intro">Enter the 6-digit OTP sent to your email.</p>
            <input className="mt-6 w-full rounded border p-3 text-center text-2xl tracking-[0.5em]" maxLength={6} inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" />
            <Button className="mt-4 w-full" onClick={submitOtp}>Verify email</Button>
            <Button variant="outline" className="mt-2 w-full" onClick={resendOtp} disabled={resendVerification.isPending}>
              {resendVerification.isPending ? "Sending..." : "Resend OTP"}
            </Button>
            {resendMessage && <p className="mt-3 text-center text-sm text-slate-600">{resendMessage}</p>}
            <div className="flex flex-col gap-2 mt-6">
              <Button asChild variant="ghost" className="w-full"><Link href="/register">Back to register</Link></Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function VerifyEmailFallback() {
  return (
    <main className="auth-shell">
      <Link
        className="block text-[25px] font-extrabold tracking-[-1.5px]"
        href="/"
      >
        bengalBooking<span>.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">EMAIL VERIFICATION</p>
        <h1>Loading...</h1>
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
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
