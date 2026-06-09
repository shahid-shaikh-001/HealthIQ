export type DashboardDocument = {
  id: string;
  title: string;
  documentType: string;
  processingStatus: string;
  uploadedAt: string;
};

export type DashboardMetric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalMin: number | null;
  normalMax: number | null;
  status: string;
  testedAt: string;
};

export type DashboardRecommendation = {
  metric: string;
  value: number;
  unit: string;
  status: string;
  priority: string;
  message: string;
  disclaimer: string;
};

export type DashboardData = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  stats: {
    documentCount: number;
    metricCount: number;
    abnormalMetricCount: number;
    recommendationCount: number;
  };
  latestHealthScore: {
    id: string;
    score: number;
    riskLevel: string;
    summary: string;
    calculatedAt: string;
  } | null;
  recentDocuments: DashboardDocument[];
  recentMetrics: DashboardMetric[];
  abnormalMetrics: DashboardMetric[];
  recommendations: DashboardRecommendation[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/dashboard", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard data");
  }

  return data.dashboard;
}
