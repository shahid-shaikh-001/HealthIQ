import { Brain } from "lucide-react";

type AIOverviewCardProps = {
  summary: string;
};

export default function AIOverviewCard({ summary }: AIOverviewCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
          <Brain className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-white">AI Health Overview</h3>
          <p className="text-sm text-slate-500">
            Summary based on your latest health records
          </p>
        </div>
      </div>

      <p className="text-sm leading-7 text-slate-400">{summary}</p>
    </div>
  );
}
