import { LucideIcon } from "lucide-react";

type InsightCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  level: string;
};

function getLevelClass(level: string) {
  const normalized = level.toUpperCase();

  if (
    normalized === "HIGH" ||
    normalized === "ABNORMAL" ||
    normalized === "LOW"
  ) {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  if (normalized === "MEDIUM" || normalized === "WARNING") {
    return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-cyan-300/20 bg-cyan-500/10 text-cyan-300";
}

export default function InsightCard({
  title,
  description,
  icon: Icon,
  level,
}: InsightCardProps) {
  const levelClass = getLevelClass(level);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${levelClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-white">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${levelClass}`}>
          {level}
        </span>
      </div>
    </div>
  );
}
