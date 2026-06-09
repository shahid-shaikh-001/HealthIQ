"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, TrendingUp } from "lucide-react";

import BiomarkerLineChart from "../../../components/charts/BiomarkerLineChart";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingState from "../../../components/shared/LoadingState";
import { DashboardData, DashboardMetric, getDashboardData } from "../../../lib/dashboard-api";

type GroupedMetric = {
  name: string;
  unit: string;
  status: string;
  normalMin: number | null;
  normalMax: number | null;
  data: {
    date: string;
    value: number;
  }[];
};

function formatMetricDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function groupMetricsByName(metrics: DashboardMetric[]): GroupedMetric[] {
  const metricMap = new Map<string, GroupedMetric>();

  for (const metric of metrics) {
    const existing = metricMap.get(metric.name);

    if (!existing) {
      metricMap.set(metric.name, {
        name: metric.name,
        unit: metric.unit,
        status: metric.status,
        normalMin: metric.normalMin,
        normalMax: metric.normalMax,
        data: [
          {
            date: formatMetricDate(metric.testedAt),
            value: metric.value,
          },
        ],
      });

      continue;
    }

    existing.data.push({
      date: formatMetricDate(metric.testedAt),
      value: metric.value,
    });

    existing.status = metric.status;
    existing.normalMin = metric.normalMin;
    existing.normalMax = metric.normalMax;
  }

  return Array.from(metricMap.values()).map((metric) => ({
    ...metric,
    data: metric.data.reverse(),
  }));
}

export default function TrendsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrends() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load health trends"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTrends();
  }, []);

  const groupedMetrics = useMemo(() => {
    if (!dashboard) return [];
    return groupMetricsByName(dashboard.recentMetrics);
  }, [dashboard]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading trends"
        description="Fetching extracted biomarkers and chart data."
      />
    );
  }

  if (error || !dashboard) {
    return (
      <ErrorState
        title="Failed to load trends"
        description={error || "Trend data is unavailable."}
      />
    );
  }

  if (groupedMetrics.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Health Trends</h1>
          <p className="text-muted-foreground">
            Track biomarkers across reports to detect long-term changes.
          </p>
        </div>

        <EmptyState
          icon={BarChart3}
          title="No biomarker trends available"
          description="Upload and process reports to generate biomarker trend charts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Health Trends</h1>
        <p className="text-muted-foreground">
          Track extracted biomarkers across uploaded medical reports.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <TrendingUp className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">{groupedMetrics.length}</h2>
          <p className="text-sm text-muted-foreground">Tracked biomarkers</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <BarChart3 className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">{dashboard.stats.metricCount}</h2>
          <p className="text-sm text-muted-foreground">Extracted metrics</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-3 w-fit rounded-xl bg-muted p-3">
            <Activity className="h-5 w-5" />
          </div>

          <h2 className="text-2xl font-bold">
            {dashboard.stats.abnormalMetricCount}
          </h2>
          <p className="text-sm text-muted-foreground">Abnormal markers</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {groupedMetrics.map((metric) => (
          <BiomarkerLineChart
            key={metric.name}
            title={metric.name}
            unit={metric.unit}
            data={metric.data}
            normalMin={metric.normalMin}
            normalMax={metric.normalMax}
            status={metric.status}
          />
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Trend interpretation</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          These charts use extracted biomarker values from your processed reports.
          If a chart has only one point, that means HealthIQ currently has only one
          processed result for that biomarker. Upload more historical reports to make
          the trend line more useful.
        </p>
      </div>
    </div>
  );
}
