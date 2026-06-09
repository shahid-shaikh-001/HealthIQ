type HealthScoreCardProps = {
  score: number;
  riskLevel: string;
  summary: string;
};

export default function HealthScoreCard({
  score,
  riskLevel,
  summary,
}: HealthScoreCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Health Score</p>
          <h3 className="mt-2 text-4xl font-bold">{score}</h3>

          <span className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Risk Level: {riskLevel}
          </span>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {summary}
          </p>
        </div>

        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-muted">
          <span className="text-xl font-bold">{score}%</span>
        </div>
      </div>
    </div>
  );
}
