"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  FileText,
  HeartPulse,
} from "lucide-react";

import AIOverviewCard from "../../components/dashboard/AIOverviewCard";
import HealthScoreCard from "../../components/dashboard/HealthScoreCard";
import RecentDocuments from "../../components/dashboard/RecentDocuments";
import StatCard from "../../components/dashboard/StatCard";
import ErrorState from "../../components/shared/ErrorState";
import LoadingState from "../../components/shared/LoadingState";
import {
  DashboardData,
  getDashboardData,
} from "../../lib/dashboard-api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load dashboard"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading dashboard"
        description="Fetching your latest health intelligence data."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        description={error || "Dashboard data is unavailable."}
      />
    );
  }

  const healthScore = dashboard.latestHealthScore?.score ?? 0;
  const riskLevel = dashboard.latestHealthScore?.riskLevel ?? "UNKNOWN";
  const summary =
    dashboard.latestHealthScore?.summary ??
    "Upload more reports to generate your health summary.";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track your medical reports, health score, risk signals, and AI insights.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <HealthScoreCard
            score={healthScore}
            riskLevel={riskLevel}
            summary={summary}
          />
        </div>

        <StatCard
          title="Documents"
          value={String(dashboard.stats.documentCount)}
          description="Uploaded reports"
          icon={FileText}
        />

        <StatCard
          title="Metrics"
          value={String(dashboard.stats.metricCount)}
          description="Extracted health values"
          icon={HeartPulse}
        />

        <StatCard
          title="Alerts"
          value={String(dashboard.stats.abnormalMetricCount)}
          description="Abnormal values"
          icon={AlertTriangle}
        />

        <StatCard
          title="Recommendations"
          value={String(dashboard.stats.recommendationCount)}
          description="Preventive suggestions"
          icon={Bell}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AIOverviewCard summary={summary} />
        <RecentDocuments documents={dashboard.recentDocuments} />
      </div>
    </div>
  );
}
