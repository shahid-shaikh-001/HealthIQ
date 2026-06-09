"use client";

import { Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, HeartPulse, ShieldCheck } from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <HeartPulse className="h-6 w-6" />
            </div>

            <h1 className="text-3xl font-bold">Sign in to HealthIQ</h1>
            <p className="mt-2 text-muted-foreground">
              Access your preventive health dashboard and uploaded medical records.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="flex w-full items-center justify-center gap-3 rounded-xl border px-5 py-3 text-sm font-medium hover:bg-muted"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold">
                G
              </span>
              Continue with Google
            </button>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              HealthIQ uses Google authentication for secure account access.
            </p>
          </div>
        </div>
      </section>

      <section className="hidden border-l bg-muted/30 p-10 lg:flex lg:items-center">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 w-fit rounded-3xl bg-background p-5 shadow-sm">
            <ShieldCheck className="h-12 w-12" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight">
            Your medical data should stay private, organized, and understandable.
          </h2>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            HealthIQ helps users upload medical reports, extract important values,
            track biomarker trends, and understand results with AI assistance.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading sign-in page...</p>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
