import { CalendarClock, LucideIcon } from "lucide-react";

type ReminderItemProps = {
  title: string;
  description: string;
  date: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  icon?: LucideIcon;
};

export default function ReminderItem({
  title,
  description,
  date,
  priority,
  icon: Icon = CalendarClock,
}: ReminderItemProps) {
  const priorityClass =
    priority === "HIGH"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : priority === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      : "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4">
        <div className="h-fit rounded-xl bg-muted p-3">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{title}</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClass}`}>
              {priority}
            </span>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="rounded-xl border px-4 py-2 text-sm font-medium">
        {date}
      </div>
    </div>
  );
}
