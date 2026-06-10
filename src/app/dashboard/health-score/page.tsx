"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import ScoreBreakdownCard from "../../../components/health/ScoreBreakdownCard";
import RecommendationCard from "../../../components/health/RecommendationCard";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";
import { DashboardData, getDashboardData } from "../../../lib/dashboard-api";

function getRiskStyle(riskLevel: string) {
  if (riskLevel === "LOW") {
    return {
      label: "Low Risk",
      className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
      ring: "border-emerald-300/30",
      fill: "bg-emerald-300",
    };
  }

  if (riskLevel === "MEDIUM") {
    return {
      label: "Medium Risk",
      className: "border-yellow-300/20 bg-yellow-500/10 text-yellow-300",
      ring: "border-yellow-300/30",
      fill: "bg-yellow-300",
    };
  }

  if (riskLevel === "HIGH") {
    return {
      label: "High Risk",
      className: "border-red-300/20 bg-red-500/10 text-red-300",
      ring: "border-red-300/30",
      fill: "bg-red-300",
    };
  }

  return {
    label: "Unknown Risk",
    className: "border-slate-300/20 bg-white/10 text-slate-300",
    ring: "border-slate-300/20",
    fill: "bg-slate-300",
  };
}

export default function HealthScorePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHealthScore() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load health score"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadHealthScore();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading health score"
        description="Fetching your latest score, risks, and recommendations."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load health score"
        description={error || "Health score data is unavailable."}
      />
    );
  }

  const score = dashboard.latestHealthScore?.score ?? 0;
  const riskLevel = dashboard.latestHealthScore?.riskLevel ?? "UNKNOWN";
  const summary =
    dashboard.latestHealthScore?.summary ??
    "Upload reports to generate your health score summary.";

  const normalMetrics =
    dashboard.stats.metricCount - dashboard.stats.abnormalMetricCount;

  const biomarkerStability =
    dashboard.stats.metricCount > 0
      ? Math.round((normalMetrics / dashboard.stats.metricCount) * 100)
      : 0;

  const riskControl =
    riskLevel === "LOW"
      ? 85
      : riskLevel === "MEDIUM"
      ? 60
      : riskLevel === "HIGH"
      ? 35
      : 0;

  const reportConsistency =
    dashboard.stats.documentCount >= 5
      ? 90
      : dashboard.stats.documentCount >= 3
      ? 70
      : dashboard.stats.documentCount >= 1
      ? 45
      : 0;

  const preventiveReadiness =
    dashboard.stats.recommendationCount > 0 ? 80 : 60;

  const breakdown = [
    {
      title: "Biomarker Stability",
      score: biomarkerStability,
      description: `${normalMetrics} normal out of ${dashboard.stats.metricCount} extracted health metrics.`,
    },
    {
      title: "Risk Control",
      score: riskControl,
      description: `Current backend risk level is ${riskLevel}.`,
    },
    {
      title: "Report Consistency",
      score: reportConsistency,
      description: `${dashboard.stats.documentCount} medical document(s) uploaded for analysis.`,
    },
    {
      title: "Preventive Readiness",
      score: preventiveReadiness,
      description: `${dashboard.stats.recommendationCount} preventive recommendation(s) available.`,
    },
  ];

  const riskStyle = getRiskStyle(riskLevel);
  const scoreWidth = Math.max(0, Math.min(score, 100));

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <HeartPulse className="h-4 w-4 text-cyan-300" />
            Preventive health score
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Health Score
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            A preventive health rating based on uploaded reports, extracted
            biomarkers, abnormal markers, and AI-generated recommendations.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${riskStyle.className}`}
        >
          <ShieldCheck className="h-4 w-4" />
          {riskStyle.label}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="text-center">
            <div
              className={`mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[14px] ${riskStyle.ring} bg-slate-950/45 shadow-2xl shadow-black/20`}
            >
              <div>
                <p className="text-6xl font-semibold tracking-tight text-white">
                  {score}
                </p>
                <p className="mt-1 text-sm text-slate-500">/ 100</p>
              </div>
            </div>

            <h2 className="mt-7 text-2xl font-semibold text-white">
              {riskStyle.label}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
              {summary}
            </p>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>Score strength</span>
              <span>{scoreWidth}%</span>
            </div>

            <div className="h-2 rounded-full bg-white/10">
              <div
                className={`h-2 rounded-full ${riskStyle.fill}`}
                style={{ width: `${scoreWidth}%` }}
              />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <HeartPulse className="mx-auto h-5 w-5 text-cyan-300" />
              <p className="mt-2 text-lg font-semibold text-white">
                {dashboard.stats.metricCount}
              </p>
              <p className="text-xs text-slate-500">Metrics</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <AlertTriangle className="mx-auto h-5 w-5 text-yellow-300" />
              <p className="mt-2 text-lg font-semibold text-white">
                {dashboard.stats.abnormalMetricCount}
              </p>
              <p className="text-xs text-slate-500">Alerts</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <FileText className="mx-auto h-5 w-5 text-cyan-300" />
              <p className="mt-2 text-lg font-semibold text-white">
                {dashboard.stats.documentCount}
              </p>
              <p className="text-xs text-slate-500">Reports</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {breakdown.map((item) => (
            <ScoreBreakdownCard
              key={item.title}
              title={item.title}
              score={item.score}
              description={item.description}
            />
          ))}
        </section>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <TrendingUp className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Preventive Recommendations
              </h2>

              <p className="text-sm text-slate-500">
                Backend-generated suggestions based on abnormal metrics.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            {dashboard.recommendations.length} active
          </span>
        </div>

        {dashboard.recommendations.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-5">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <p className="text-sm text-emerald-200">
              No active recommendations found.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.recommendations.map((item, index) => (
              <RecommendationCard
                key={`${item.metric}-${item.status}-${item.value}-${index}`}
                title={`${item.metric}: ${item.value} ${item.unit}`}
                description={item.message}
                priority={item.priority}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">How this score works</h2>
            <p className="text-sm text-slate-500">
              Calculation context and safety note
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          This score is calculated from uploaded medical reports, extracted
          metrics, abnormal markers, recommendations, and backend health scoring
          logic. It is not a diagnosis or medical-grade risk score.
        </p>
      </section>
    </div>
  );
}
