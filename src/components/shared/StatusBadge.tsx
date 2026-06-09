type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  const statusClass =
    normalizedStatus === "COMPLETED"
      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
      : normalizedStatus === "PROCESSING"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : normalizedStatus === "FAILED"
      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";

  const label =
    normalizedStatus === "COMPLETED"
      ? "Completed"
      : normalizedStatus === "PROCESSING"
      ? "Processing"
      : normalizedStatus === "FAILED"
      ? "Failed"
      : "Pending";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
      {label}
    </span>
  );
}
