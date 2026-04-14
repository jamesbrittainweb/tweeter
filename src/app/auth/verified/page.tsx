"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default function VerifiedPage() {
  const router = useRouter();
  const secondsTotal = 3;
  const [secondsLeft, setSecondsLeft] = useState(secondsTotal);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      router.replace("/home");
    }, secondsTotal * 1000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [router]);

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-brand" />
            <div className="text-sm font-extrabold">Tweeter</div>
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
            Email verified!
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your account is ready. Redirecting in{" "}
            <span className="font-extrabold text-foreground">
              {secondsLeft}
            </span>
            …
          </p>
        </div>
      </div>
    </main>
  );
}
