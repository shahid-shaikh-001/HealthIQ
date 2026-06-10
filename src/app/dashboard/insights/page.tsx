"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import InsightCard from "../../../components/insights/InsightCard";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";
import EmptyState from "../../../components/shared/EmptyState";
import { DashboardData, getDashboardData } from "../../../lib/dashboard-api";

function getRiskBadgeClass(riskLevel?: string) {
  if (riskLevel === "LOW") {
    return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
  }

  if (riskLevel === "MEDIUM") {
    return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
  }

  if (riskLevel === "HIGH") {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  return "border-slate-300/20 bg-white/10 text-slate-300";
}

export default function InsightsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load insights"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading insights"
        description="Fetching AI summary, abnormal markers, and recommendations."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load insights"
        description={error || "Insights data is unavailable."}
      />
    );
  }

  const summary =
    dashboard.latestHealthScore?.summary ||
    "Upload medical reports to generate AI health insights.";

  const riskLevel = dashboard.latestHealthScore?.riskLevel || "UNKNOWN";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <Brain className="h-4 w-4 text-cyan-300" />
            AI health intelligence
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            AI Health Insights
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Preventive observations generated from your uploaded medical
            documents, extracted biomarkers, and backend health analysis.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${getRiskBadgeClass(
            riskLevel
          )}`}
        >
          <HeartPulse className="h-4 w-4" />
          {riskLevel} Risk
        </div>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Brain className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Latest AI Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Generated from latest health score and extracted report data.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
          <p className="text-sm leading-7 text-slate-400">{summary}</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {dashboard.stats.metricCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Extracted metrics</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {dashboard.stats.abnormalMetricCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Abnormal markers</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <Stethoscope className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {dashboard.stats.recommendationCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Recommendations</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <HeartPulse className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">{riskLevel}</h2>

          <p className="mt-1 text-sm text-slate-500">Risk level</p>
        </div>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Abnormal Marker Insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Values that are currently outside their reference range.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            {dashboard.abnormalMetrics.length} markers
          </span>
        </div>

        {dashboard.abnormalMetrics.length === 0 ? (
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-5">
            <EmptyState
              icon={ShieldCheck}
              title="No abnormal markers found"
              description="Your extracted metrics are currently within reference range."
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.abnormalMetrics.map((metric) => (
              <InsightCard
                key={metric.id}
                title={`${metric.name}: ${metric.value} ${metric.unit}`}
                description={`Status is ${metric.status}. Reference range: ${
                  metric.normalMin ?? "N/A"
                } - ${metric.normalMax ?? "N/A"} ${
                  metric.unit
                }. Track this value over time and discuss repeated abnormal results with a qualified clinician.`}
                icon={AlertTriangle}
                level={metric.status}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Preventive Recommendations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Suggestions generated from detected abnormal metrics.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            {dashboard.recommendations.length} active
          </span>
        </div>

        {dashboard.recommendations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
            <EmptyState
              icon={ShieldCheck}
              title="No recommendations available"
              description="Upload more reports to generate personalized recommendations."
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.recommendations.map((recommendation, index) => (
              <InsightCard
                key={`${recommendation.metric}-${recommendation.status}-${recommendation.value}-${index}`}
                title={recommendation.metric}
                description={recommendation.message}
                icon={Stethoscope}
                level={recommendation.priority}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Medical Disclaimer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              HealthIQ provides educational insights, not medical diagnosis.
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          Always consult a qualified doctor before making medical decisions. AI
          analysis should support awareness and prevention, not replace clinical
          judgment.
        </p>
      </section>
    </div>
  );
}
