import { LucideIcon } from "lucide-react";

type ReminderItemProps = {
  title: string;
  description: string;
  date: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  icon: LucideIcon;
};

function getPriorityClass(priority: string) {
  if (priority === "HIGH") {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  if (priority === "MEDIUM") {
    return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
  }

  return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
}

export default function ReminderItem({
  title,
  description,
  date,
  priority,
  icon: Icon,
}: ReminderItemProps) {
  const priorityClass = getPriorityClass(priority);

  return (
    <div className="group rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${priorityClass}`}
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

        <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${priorityClass}`}>
            {priority}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}
