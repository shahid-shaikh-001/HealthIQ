import { Brain } from "lucide-react";

type AIOverviewCardProps = {
  summary: string;
};

export default function AIOverviewCard({ summary }: AIOverviewCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-muted p-3">
          <Brain className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold">AI Health Overview</h3>
          <p className="text-sm text-muted-foreground">
            Summary based on your latest health records
          </p>
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {summary}
      </p>
    </div>
  );
}
