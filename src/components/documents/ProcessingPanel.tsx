import { AlertTriangle, Loader2, Sparkles } from "lucide-react";
import StatusBadge from "../../components/shared/StatusBadge";

type ProcessingPanelProps = {
  status: string;
  isProcessing: boolean;
  onProcess: () => void;
};

export default function ProcessingPanel({
  status,
  isProcessing,
  onProcess,
}: ProcessingPanelProps) {
  const canProcess = status === "PENDING" || status === "FAILED";

  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="font-semibold text-white">AI Processing</h2>
              <p className="text-sm text-slate-500">
                Extract text, summaries, abnormal values, and health metrics.
              </p>
            </div>
          </div>

          <StatusBadge status={isProcessing ? "PROCESSING" : status} />

          {status === "FAILED" && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
              <p className="text-sm leading-6 text-red-200">
                Processing failed. This can happen if the AI provider is
                overloaded or the uploaded file is unclear. Retry processing when
                ready.
              </p>
            </div>
          )}
        </div>

        {canProcess && (
          <button
            type="button"
            onClick={onProcess}
            disabled={isProcessing}
            className="healthiq-primary-button inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {status === "FAILED" ? "Retry AI Processing" : "Process with AI"}
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
