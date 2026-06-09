import Link from "next/link";
import { DashboardDocument } from "../../lib/dashboard-api";
import StatusBadge from "../../components/shared/StatusBadge";

type RecentDocumentsProps = {
  documents: DashboardDocument[];
};

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold">Recent Documents</h3>
        <p className="text-sm text-muted-foreground">
          Latest uploaded health records
        </p>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No recent documents found.
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <Link
              key={document.id}
              href={`/dashboard/documents/${document.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border p-3 transition hover:bg-muted"
            >
              <div>
                <p className="text-sm font-medium">{document.title}</p>
                <p className="text-xs text-muted-foreground">
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
