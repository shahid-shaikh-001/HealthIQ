"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, ShieldCheck, TrendingUp } from "lucide-react";

import BiomarkerLineChart from "../../../components/charts/BiomarkerLineChart";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingState from "../../../components/shared/LoadingState";
import {
  DashboardData,
  DashboardMetric,
  getDashboardData,
} from "../../../lib/dashboard-api";

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
      <div className="space-y-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <TrendingUp className="h-4 w-4 text-cyan-300" />
            Biomarker trend tracking
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Health Trends
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Track biomarkers across processed reports to detect long-term
            changes and repeated abnormal values.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <EmptyState
            icon={BarChart3}
            title="No biomarker trends available"
            description="Upload and process reports to generate biomarker trend charts."
          />
        </div>
      </div>
    );
  }

  const singlePointMetrics = groupedMetrics.filter(
    (metric) => metric.data.length === 1
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <TrendingUp className="h-4 w-4 text-cyan-300" />
            Biomarker trend tracking
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Health Trends
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Track extracted biomarkers across uploaded medical reports and
            monitor how values change over time.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-300">
          <BarChart3 className="h-4 w-4" />
          {groupedMetrics.length} tracked biomarkers
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <TrendingUp className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {groupedMetrics.length}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Tracked biomarkers</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <BarChart3 className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {dashboard.stats.metricCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Extracted metrics</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300">
            <Activity className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {dashboard.stats.abnormalMetricCount}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Abnormal markers</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <h2 className="text-3xl font-semibold text-white">
            {singlePointMetrics}
          </h2>

          <p className="mt-1 text-sm text-slate-500">Need more history</p>
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

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-white">Trend interpretation</h2>
            <p className="text-sm text-slate-500">
              How to read biomarker trend charts
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-slate-400">
          These charts use extracted biomarker values from your processed
          reports. If a chart has only one point, HealthIQ currently has only one
          processed result for that biomarker. Upload more historical reports to
          make the trend line more useful.
        </p>
      </section>
    </div>
  );
}
