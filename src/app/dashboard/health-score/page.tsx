"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Health Score</h1>
        <p className="text-muted-foreground">
          Preventive health rating based on reports, biomarkers, and AI analysis.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-muted">
            <div>
              <p className="text-5xl font-bold">{score}</p>
              <p className="text-sm text-muted-foreground">/ 100</p>
            </div>
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            {riskLevel} Risk Level
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border p-3">
              <HeartPulse className="mx-auto h-5 w-5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {dashboard.stats.metricCount} Metrics
              </p>
            </div>

            <div className="rounded-xl border p-3">
              <AlertTriangle className="mx-auto h-5 w-5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {dashboard.stats.abnormalMetricCount} Alerts
              </p>
            </div>

            <div className="rounded-xl border p-3">
              <FileText className="mx-auto h-5 w-5" />
              <p className="mt-2 text-xs text-muted-foreground">
                {dashboard.stats.documentCount} Reports
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {breakdown.map((item) => (
            <ScoreBreakdownCard
              key={item.title}
              title={item.title}
              score={item.score}
              description={item.description}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-muted p-3">
            <TrendingUp className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Preventive Recommendations
            </h2>
            <p className="text-sm text-muted-foreground">
              Backend-generated suggestions based on abnormal metrics.
            </p>
          </div>
        </div>

        {dashboard.recommendations.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm text-muted-foreground">
                No active recommendations found.
              </p>
            </div>
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
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="font-semibold">How this score works</h2>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          This score is calculated from uploaded medical reports, extracted metrics,
          abnormal markers, recommendations, and backend health scoring logic. It is
          not a diagnosis or medical-grade risk score.
        </p>
      </div>
    </div>
  );
}
