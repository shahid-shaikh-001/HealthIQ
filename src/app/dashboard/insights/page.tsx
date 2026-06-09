"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import InsightCard from "../../../components/insights/InsightCard";
import LoadingState from "../../../components/shared/LoadingState";
import ErrorState from "../../../components/shared/ErrorState";
import EmptyState from "../../../components/shared/EmptyState";
import { DashboardData, getDashboardData } from "../../../lib/dashboard-api";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Health Insights</h1>
        <p className="text-muted-foreground">
          Preventive observations generated from your real medical documents.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-muted p-3">
            <Brain className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Latest AI Summary</h2>
            <p className="text-sm text-muted-foreground">
              Generated from latest health score and extracted report data
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {summary}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">{dashboard.stats.metricCount}</h2>
          <p className="text-sm text-muted-foreground">Extracted metrics</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">
            {dashboard.stats.abnormalMetricCount}
          </h2>
          <p className="text-sm text-muted-foreground">Abnormal markers</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <Stethoscope className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">
            {dashboard.stats.recommendationCount}
          </h2>
          <p className="text-sm text-muted-foreground">Recommendations</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <HeartPulse className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">
            {dashboard.latestHealthScore?.riskLevel || "UNKNOWN"}
          </h2>
          <p className="text-sm text-muted-foreground">Risk level</p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Abnormal Marker Insights</h2>
          <p className="text-sm text-muted-foreground">
            Values that are currently outside their reference range.
          </p>
        </div>

        {dashboard.abnormalMetrics.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No abnormal markers found"
            description="Your extracted metrics are currently within reference range."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.abnormalMetrics.map((metric) => (
              <InsightCard
                key={metric.id}
                title={`${metric.name}: ${metric.value} ${metric.unit}`}
                description={`Status is ${metric.status}. Reference range: ${
                  metric.normalMin ?? "N/A"
                } - ${metric.normalMax ?? "N/A"} ${metric.unit}. Track this value over time and discuss repeated abnormal results with a qualified clinician.`}
                icon={AlertTriangle}
                level={metric.status}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Preventive Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            Suggestions generated from detected abnormal metrics.
          </p>
        </div>

        {dashboard.recommendations.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No recommendations available"
            description="Upload more reports to generate personalized recommendations."
          />
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

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-muted p-3">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Medical Disclaimer</h2>
            <p className="text-sm text-muted-foreground">
              HealthIQ provides educational insights, not medical diagnosis.
            </p>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Always consult a qualified doctor before making medical decisions. AI
          analysis should support awareness and prevention, not replace clinical
          judgment.
        </p>
      </div>
    </div>
  );
}
