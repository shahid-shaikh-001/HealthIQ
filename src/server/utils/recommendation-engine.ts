type MetricStatus = "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN";

type HealthMetricInput = {
  name: string;
  value: number | null;
  unit: string | null;
  normalMin: number | null;
  normalMax: number | null;
  status: MetricStatus;
};

type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Recommendation = {
  metric: string;
  value: number | null;
  unit: string | null;
  status: MetricStatus;
  priority: RecommendationPriority;
  message: string;
  disclaimer: string;
};

function getPriority(status: MetricStatus): RecommendationPriority {
  if (status === "CRITICAL") return "URGENT";
  if (status === "LOW" || status === "HIGH") return "MEDIUM";
  if (status === "UNKNOWN") return "LOW";

  return "LOW";
}

function getMetricSpecificMessage(metric: HealthMetricInput): string {
  const metricName = metric.name.toLowerCase();

  if (metricName.includes("hemoglobin") && metric.status === "LOW") {
    return "Hemoglobin is below the reference range. Consider discussing iron, vitamin B12, folate, diet, fatigue, weakness, or bleeding history with a qualified clinician.";
  }

  if (
    (metricName.includes("wbc") ||
      metricName.includes("white blood cell")) &&
    metric.status === "HIGH"
  ) {
    return "White blood cell count is above the reference range. Consider discussing possible infection, inflammation, medication effects, or recent illness with a qualified clinician.";
  }

  if (
    (metricName.includes("wbc") ||
      metricName.includes("white blood cell")) &&
    metric.status === "LOW"
  ) {
    return "White blood cell count is below the reference range. Consider discussing immune status, recent infections, medication effects, or repeat testing with a qualified clinician.";
  }

  if (metricName.includes("glucose") && metric.status === "HIGH") {
    return "Glucose is above the reference range. Consider discussing fasting status, diet, HbA1c testing, diabetes risk, and lifestyle factors with a qualified clinician.";
  }

  if (metricName.includes("glucose") && metric.status === "LOW") {
    return "Glucose is below the reference range. Consider discussing meal timing, symptoms like dizziness or sweating, medications, and repeat testing with a qualified clinician.";
  }

  if (
    (metricName.includes("platelet") || metricName.includes("platelets")) &&
    metric.status === "HIGH"
  ) {
    return "Platelet count is above the reference range. Consider discussing inflammation, iron deficiency, recent illness, or need for repeat testing with a qualified clinician.";
  }

  if (
    (metricName.includes("platelet") || metricName.includes("platelets")) &&
    metric.status === "LOW"
  ) {
    return "Platelet count is below the reference range. Consider discussing bleeding/bruising symptoms, medications, infections, and repeat testing with a qualified clinician.";
  }

  return `${metric.name} is marked as ${metric.status}. Consider reviewing this value with a qualified clinician, especially if you have symptoms or repeated abnormal results.`;
}

export function generateRecommendations(
  metrics: HealthMetricInput[]
): Recommendation[] {
  const abnormalMetrics = metrics.filter(
    (metric) =>
      metric.status === "LOW" ||
      metric.status === "HIGH" ||
      metric.status === "CRITICAL" ||
      metric.status === "UNKNOWN"
  );

  return abnormalMetrics.map((metric) => ({
    metric: metric.name,
    value: metric.value,
    unit: metric.unit,
    status: metric.status,
    priority: getPriority(metric.status),
    message: getMetricSpecificMessage(metric),
    disclaimer:
      "This is not a diagnosis or treatment plan. Use it as a prompt for discussion with a qualified healthcare professional.",
  }));
}