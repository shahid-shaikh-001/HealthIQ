"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Info } from "lucide-react";

type ChartData = {
  date: string;
  value: number;
};

type BiomarkerLineChartProps = {
  title: string;
  unit: string;
  data: ChartData[];
  normalMin?: number | null;
  normalMax?: number | null;
  status?: string;
};

function getStatusClass(status?: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "NORMAL") {
    return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
  }

  if (
    normalized === "HIGH" ||
    normalized === "LOW" ||
    normalized === "ABNORMAL"
  ) {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
}

export default function BiomarkerLineChart({
  title,
  unit,
  data,
  normalMin,
  normalMax,
  status,
}: BiomarkerLineChartProps) {
  const latestValue = data.length > 0 ? data[data.length - 1].value : null;
  const statusClass = getStatusClass(status);
  const hasTrend = data.length >= 2;

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Historical biomarker movement over time
            </p>
          </div>
        </div>

        {status && (
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}
          >
            {status}
          </span>
        )}
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">Latest value</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {latestValue ?? "N/A"}{" "}
            {latestValue !== null && (
              <span className="text-sm font-normal text-slate-500">{unit}</span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">Normal min</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {normalMin ?? "N/A"}{" "}
            {normalMin !== null && normalMin !== undefined && (
              <span className="text-sm font-normal text-slate-500">{unit}</span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-500">Normal max</p>
          <p className="mt-1 text-xl font-semibold text-white">
            {normalMax ?? "N/A"}{" "}
            {normalMax !== null && normalMax !== undefined && (
              <span className="text-sm font-normal text-slate-500">{unit}</span>
            )}
          </p>
        </div>
      </div>

      {!hasTrend ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <Info className="h-5 w-5" />
            </div>

            <h3 className="text-base font-semibold text-white">
              More reports needed
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              This biomarker has only one extracted value. Upload and process
              more historical reports to generate a visible trend line.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-72 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                stroke="rgba(148, 163, 184, 0.16)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b" }}
              />

              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b" }}
              />

              <Tooltip
                formatter={(value) => [`${value} ${unit}`, title]}
                labelFormatter={(label) => `Date: ${label}`}
              />

              {normalMin !== undefined && normalMin !== null && (
                <ReferenceLine
                  y={normalMin}
                  stroke="rgba(52, 211, 153, 0.45)"
                  strokeDasharray="4 4"
                />
              )}

              {normalMax !== undefined && normalMax !== null && (
                <ReferenceLine
                  y={normalMax}
                  stroke="rgba(250, 204, 21, 0.45)"
                  strokeDasharray="4 4"
                />
              )}

              <Line
                type="monotone"
                dataKey="value"
                stroke="#67e8f9"
                strokeWidth={3}
                dot
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
