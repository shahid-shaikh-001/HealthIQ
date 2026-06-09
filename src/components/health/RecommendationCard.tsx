import { AlertTriangle, CheckCircle2 } from "lucide-react";

type RecommendationCardProps = {
  title: string;
  description: string;
  priority?: string;
};

export default function RecommendationCard({
  title,
  description,
  priority = "LOW",
}: RecommendationCardProps) {
  const isImportant = priority === "HIGH" || priority === "MEDIUM";

  return (
    <div className="flex gap-3 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mt-1 rounded-xl bg-muted p-2">
        {isImportant ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5" />
        )}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">{title}</h2>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {priority}
          </span>
        </div>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
