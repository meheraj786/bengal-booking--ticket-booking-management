"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "@/hooks/use-auth";
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
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setState("missing-token");
      return;
    }

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
  }, [token, verifyEmail]);

  return (
    <main className="auth-shell">
      <Link className="brand" href="/">
        evently<span>.</span>
      </Link>
      <div className="auth-card">
        <p className="eyebrow">EMAIL VERIFICATION</p>

        {state === "idle" && (
          <>
            <h1>Preparing verification...</h1>
            <p className="auth-intro">Please wait a moment.</p>
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
            <Button asChild className="button auth-button w-full mt-4">
              <Link href="/login">Continue to login →</Link>
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
            </div>
          </>
        )}

        {state === "missing-token" && (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
            <h1>Missing verification link</h1>
            <p className="auth-error" role="alert">
              This page needs a valid verification token. Check the link in your
              email.
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <Button asChild className="w-full">
                <Link href="/register">Back to register</Link>
              </Button>
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
      <Link className="brand" href="/">
        evently<span>.</span>
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
