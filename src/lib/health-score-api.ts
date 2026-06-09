export async function calculateHealthScore() {
  const response = await fetch("/api/health-score/calculate", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to calculate health score");
  }

  return data.healthScore;
}
