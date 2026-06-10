"use client";

import { Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b14] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_34rem),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.10),transparent_34rem)]" />
      <div className="absolute inset-0 healthiq-grid-bg opacity-[0.14]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-16 px-6 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <Link
  href="/"
  className="group mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
>
  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] transition group-hover:-translate-x-0.5 group-hover:bg-cyan-300/10 group-hover:text-cyan-300">
    <ArrowLeft className="h-4 w-4" />
  </span>
  <span className="pr-2">Back to home</span>
</Link>

            <div className="mb-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300 text-slate-950">
                  <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold leading-none">
                    HealthIQ
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    Preventive health intelligence
                  </p>
                </div>
              </div>

              <h2 className="text-4xl font-semibold tracking-tight">
                Sign in to your workspace.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Access your protected dashboard for medical documents,
                biomarkers, trends, and AI-generated health summaries.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-xs font-bold">
                  G
                </span>
                Continue with Google
              </button>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-cyan-300" />
                  <p className="text-sm font-medium">Protected account access</p>
                </div>

                <p className="text-xs leading-6 text-slate-400">
                  Your reports, extracted metrics, health score, and dashboard
                  data are connected to your authenticated user account.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

              <p className="text-xs leading-6 text-slate-500">
                HealthIQ supports awareness and prevention. It does not provide
                diagnosis, treatment, or emergency medical guidance.
              </p>
            </div>
          </div>
        </section>

        <section className="hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-10 rounded-[2.5rem] bg-cyan-300/10 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1627] p-6">
                <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-sm text-slate-500">Workspace preview</p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Health overview
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Private
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300 text-slate-950">
                      <HeartPulse className="h-5 w-5" />
                    </div>

                    <p className="text-sm text-slate-400">Health Score</p>
                    <p className="mt-2 text-5xl font-semibold">80</p>

                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-4/5 rounded-full bg-cyan-300" />
                    </div>

                    <p className="mt-4 text-xs leading-6 text-slate-500">
                      Based on uploaded reports, extracted metrics, and current
                      abnormal marker count.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-300" />
                          <p className="text-sm font-medium">Documents</p>
                        </div>
                        <span className="text-xs text-slate-500">Updated</span>
                      </div>

                      <p className="text-2xl font-semibold">3</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Processed medical records
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-cyan-300" />
                          <p className="text-sm font-medium">Metrics</p>
                        </div>
                        <span className="text-xs text-slate-500">Tracked</span>
                      </div>

                      <p className="text-2xl font-semibold">10</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Extracted biomarker values
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-cyan-300" />
                    <p className="font-medium">Access control</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-950/50 p-3">
                      <p className="text-xs text-slate-500">Auth</p>
                      <p className="mt-1 text-sm font-medium">Google</p>
                    </div>

                    <div className="rounded-xl bg-slate-950/50 p-3">
                      <p className="text-xs text-slate-500">Routes</p>
                      <p className="mt-1 text-sm font-medium">Protected</p>
                    </div>

                    <div className="rounded-xl bg-slate-950/50 p-3">
                      <p className="text-xs text-slate-500">Data</p>
                      <p className="mt-1 text-sm font-medium">User scoped</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-cyan-300/[0.06] p-5">
                  <p className="text-sm leading-7 text-slate-400">
                    “Recent reports show mostly stable values with selected
                    markers that may require continued monitoring.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950">
          <p className="text-sm text-slate-400">Loading sign-in page...</p>
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
