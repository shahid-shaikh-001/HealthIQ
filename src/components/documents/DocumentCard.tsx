import Link from "next/link";
import { FileText } from "lucide-react";
import StatusBadge from "../../components/shared/StatusBadge";

type MedicalDocument = {
  id: string;
  title: string;
  fileType?: string;
  documentType: string;
  processingStatus: string;
  uploadedAt: string;
};

export default function DocumentCard({
  document,
}: {
  document: MedicalDocument;
}) {
  return (
    <Link
      href={`/dashboard/documents/${document.id}`}
      className="block rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="rounded-xl bg-muted p-3">
          <FileText className="h-5 w-5" />
        </div>

        <StatusBadge status={document.processingStatus} />
      </div>

      <h2 className="line-clamp-1 font-semibold">{document.title}</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {document.documentType?.replace("_", " ")}
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
