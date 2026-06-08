type MetricStatus = "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN";

type HealthMetricInput = {
  status: MetricStatus;
};

type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export function calculateHealthScore(metrics: HealthMetricInput[]): {
  score: number;
  riskLevel: RiskLevel;
  summary: string;
} {
  if (metrics.length === 0) {
    return {
      score: 0,
      riskLevel: "MODERATE",
      summary: "No health metrics found. Upload and process a medical report to calculate your health score.",
    };
  }

  let score = 100;

  for (const metric of metrics) {
    if (metric.status === "LOW" || metric.status === "HIGH") {
      score -= 5;
    }

    if (metric.status === "CRITICAL") {
      score -= 15;
    }

    if (metric.status === "UNKNOWN") {
      score -= 2;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let riskLevel: RiskLevel = "LOW";

  if (score < 40) {
    riskLevel = "CRITICAL";
  } else if (score < 60) {
    riskLevel = "HIGH";
  } else if (score < 80) {
    riskLevel = "MODERATE";
  }

  const abnormalCount = metrics.filter(
    (metric) =>
      metric.status === "LOW" ||
      metric.status === "HIGH" ||
      metric.status === "CRITICAL"
  ).length;

  const summary =
    abnormalCount === 0
      ? "Your processed health metrics are currently within normal range based on this basic scoring model."
      : `${abnormalCount} health metric(s) need attention based on this basic scoring model.`;

  return {
    score,
    riskLevel,
    summary,
  };
}