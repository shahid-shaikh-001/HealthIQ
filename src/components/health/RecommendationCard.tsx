import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

type RecommendationCardProps = {
  title: string;
  description: string;
  priority: string;
};

function getPriorityConfig(priority: string) {
  const normalized = priority.toUpperCase();

  if (normalized === "HIGH") {
    return {
      icon: AlertTriangle,
      className: "border-red-300/20 bg-red-500/10 text-red-300",
    };
  }

  if (normalized === "MEDIUM") {
    return {
      icon: Info,
      className: "border-yellow-300/20 bg-yellow-500/10 text-yellow-300",
    };
  }

  return {
    icon: CheckCircle2,
    className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
  };
}

export default function RecommendationCard({
  title,
  description,
  priority,
}: RecommendationCardProps) {
  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${config.className}`}
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

        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}>
          {priority}
        </span>
      </div>
    </div>
  );
}
