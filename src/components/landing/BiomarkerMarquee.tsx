"use client";

import { Activity, FileText, TrendingUp } from "lucide-react";

const biomarkers = [
  "Hemoglobin",
  "RBC",
  "WBC",
  "Platelets",
  "TSH",
  "Cholesterol",
  "Vitamin D",
  "Glucose",
  "Creatinine",
  "HDL",
  "LDL",
  "CRP",
];

export default function BiomarkerMarquee() {
  return (
    <section className="relative border-y border-white/10 bg-slate-950 px-6 py-14">
      <div className="mx-auto mb-8 grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <Activity className="h-4 w-4 text-cyan-300" />
            Biomarker tracking
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Track the markers that matter.
          </h2>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-400 lg:ml-auto">
          HealthIQ extracts measurable values from your reports and organizes
          them into a timeline, so repeated low, high, or changing values are
          easier to notice over time.
        </p>
      </div>

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-slate-950 to-transparent" />

        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-3 px-5">
          {[...biomarkers, ...biomarkers, ...biomarkers].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <FileText className="mb-3 h-5 w-5 text-cyan-300" />
          <p className="text-sm font-medium text-white">Extracted from reports</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Values are detected from uploaded medical documents after processing.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <TrendingUp className="mb-3 h-5 w-5 text-cyan-300" />
          <p className="text-sm font-medium text-white">Tracked over time</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Multiple reports help show whether values are stable, rising, or falling.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <Activity className="mb-3 h-5 w-5 text-cyan-300" />
          <p className="text-sm font-medium text-white">Used for insights</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Abnormal markers help generate reminders, recommendations, and score updates.
          </p>
        </div>
      </div>
    </section>
  );
}
