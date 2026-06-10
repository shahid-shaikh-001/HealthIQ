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
  const safeScore = Math.max(0, Math.min(score, 100));

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-300">
          {safeScore}
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-cyan-300"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  );
}
