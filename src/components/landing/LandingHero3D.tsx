"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThreeDCard from "../../components/ui/ThreeDCard";
import {
  Activity,
  ArrowRight,
  Brain,
  FileText,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const biomarkers = [
  { name: "Hemoglobin", value: "12.1", unit: "g/dL", status: "Low" },
  { name: "WBC", value: "6.5", unit: "x10E3/uL", status: "Normal" },
  { name: "RBC", value: "4.12", unit: "x10E6/uL", status: "Low" },
  { name: "TSH", value: "5.8", unit: "uIU/mL", status: "High" },
];

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Normal"
      ? "bg-emerald-500/10 text-emerald-300"
      : status === "High"
      ? "bg-amber-500/10 text-amber-300"
      : "bg-rose-500/10 text-rose-300";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {status}
    </span>
  );
}

export default function LandingHero3D() {
  return (
    <section className="relative overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.16),transparent_32rem),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.14),transparent_34rem)]" />
      <div className="absolute inset-0 healthiq-grid-bg opacity-20" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-14 px-6 py-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            Private preventive health intelligence
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Understand your health records with{" "}
            <span className="text-cyan-300">clinical clarity.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            HealthIQ turns medical reports into structured biomarkers, plain-language
            summaries, trend tracking, and preventive recommendations.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Upload Report
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[0.08]"
            >
              View Dashboard
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-semibold">3</p>
              <p className="mt-1 text-xs text-slate-400">Reports uploaded</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-semibold">10</p>
              <p className="mt-1 text-xs text-slate-400">Metrics extracted</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-semibold">80</p>
              <p className="mt-1 text-xs text-slate-400">Health score</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-cyan-300/10 blur-3xl" />

          <ThreeDCard className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1627] p-5">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-400">Health overview</p>
                    <h2 className="mt-1 text-2xl font-semibold">Blood Report</h2>
                  </div>

                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Completed
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                        <HeartPulse className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">Health Score</p>
                        <p className="text-3xl font-semibold">80</p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-2 rounded-full bg-cyan-300"
                      />
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      Low risk level based on current extracted metrics.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Extracted biomarkers</p>
                        <p className="text-xs text-slate-400">
                          Latest processed report
                        </p>
                      </div>

                      <Activity className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="space-y-3">
                      {biomarkers.map((metric, index) => (
                        <motion.div
                          key={metric.name}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.3 + index * 0.08,
                          }}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07111f]/70 px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{metric.name}</p>
                            <p className="text-xs text-slate-400">
                              {metric.value} {metric.unit}
                            </p>
                          </div>

                          <StatusPill status={metric.status} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <FileText className="mb-3 h-5 w-5 text-cyan-300" />
                    <p className="text-sm font-medium">Documents</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Centralized records
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Brain className="mb-3 h-5 w-5 text-cyan-300" />
                    <p className="text-sm font-medium">AI Summary</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Plain-language insight
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <TrendingUp className="mb-3 h-5 w-5 text-cyan-300" />
                    <p className="text-sm font-medium">Trends</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Long-term tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ThreeDCard>
        </motion.div>
      </div>
    </section>
  );
}
