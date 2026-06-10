import Link from "next/link";
import { DashboardDocument } from "../../lib/dashboard-api";
import StatusBadge from "../../components/shared/StatusBadge";

type RecentDocumentsProps = {
  documents: DashboardDocument[];
};

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5">
        <h3 className="font-semibold text-white">Recent Documents</h3>
        <p className="text-sm text-slate-500">Latest uploaded health records</p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-slate-500">No recent documents found.</p>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <Link
              key={document.id}
              href={`/dashboard/documents/${document.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {document.title}
                </p>
                <p className="text-xs text-slate-500">
                  {document.documentType.replace("_", " ")}
                </p>
              </div>

              <StatusBadge status={document.processingStatus} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
