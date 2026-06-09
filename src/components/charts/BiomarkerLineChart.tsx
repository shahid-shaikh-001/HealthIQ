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

export default function BiomarkerLineChart({
  title,
  unit,
  data,
  normalMin,
  normalMax,
  status,
}: BiomarkerLineChartProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Historical biomarker movement over time
          </p>
        </div>

        {status && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {status}
          </span>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value) => [`${value} ${unit}`, title]}
              labelFormatter={(label) => `Date: ${label}`}
            />

            {normalMin !== undefined && normalMin !== null && (
              <ReferenceLine
                y={normalMin}
                strokeDasharray="4 4"
                label="Min"
              />
            )}

            {normalMax !== undefined && normalMax !== null && (
              <ReferenceLine
                y={normalMax}
                strokeDasharray="4 4"
                label="Max"
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
