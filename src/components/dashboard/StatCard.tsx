import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-3xl font-bold">{value}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-xl bg-muted p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
