type ScoreBreakdownCardProps = {
  title: string;
  score: number;
  description: string;
};

export default function ScoreBreakdownCard({
  title,
  score,
  description,
}: ScoreBreakdownCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <span className="text-2xl font-bold">{score}%</span>
      </div>

      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
