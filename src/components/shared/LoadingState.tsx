import { Loader2 } from "lucide-react";

type LoadingStateProps = {
  title?: string;
  description?: string;
};

export default function LoadingState({
  title = "Loading...",
  description = "Please wait while we fetch your data.",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border bg-card p-10 text-center shadow-sm">
      <div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
