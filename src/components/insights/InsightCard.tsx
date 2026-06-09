import { LucideIcon } from "lucide-react";

type InsightCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
};

export default function InsightCard({
  title,
  description,
  icon: Icon,
  level,
}: InsightCardProps) {
  const levelClass =
    level === "CRITICAL" || level === "HIGH"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : level === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="rounded-xl bg-muted p-3">
          <Icon className="h-5 w-5" />
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${levelClass}`}>
          {level}
        </span>
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
