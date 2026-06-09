import { LucideIcon } from "lucide-react";

type ProfileInfoCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function ProfileInfoCard({
  title,
  value,
  description,
  icon: Icon,
}: ProfileInfoCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 w-fit rounded-xl bg-muted p-3">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className="mt-1 break-words text-xl font-semibold">{value}</h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
