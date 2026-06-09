import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again after some time.",
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border bg-card p-10 text-center shadow-sm">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
