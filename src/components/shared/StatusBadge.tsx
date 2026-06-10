import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";

type StatusBadgeProps = {
  status: string;
};

const statusConfig = {
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-300",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    className: "border-cyan-300/20 bg-cyan-500/10 text-cyan-300",
    icon: Loader2,
  },
  FAILED: {
    label: "Failed",
    className: "border-red-300/20 bg-red-500/10 text-red-300",
    icon: AlertTriangle,
  },
  PENDING: {
    label: "Pending",
    className: "border-yellow-300/20 bg-yellow-500/10 text-yellow-300",
    icon: Clock,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${
          status === "PROCESSING" ? "animate-spin" : ""
        }`}
      />
      {config.label}
    </span>
  );
}
