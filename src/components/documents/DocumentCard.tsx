import Link from "next/link";
import { CalendarDays, FileText } from "lucide-react";
import StatusBadge from "../../components/shared/StatusBadge";

type MedicalDocument = {
  id: string;
  title: string;
  fileType?: string;
  documentType: string;
  processingStatus: string;
  uploadedAt: string;
};

function formatDocumentType(type: string) {
  return type.replaceAll("_", " ");
}

export default function DocumentCard({
  document,
}: {
  document: MedicalDocument;
}) {
  return (
    <Link
      href={`/dashboard/documents/${document.id}`}
      className="group block rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.075]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
          <FileText className="h-5 w-5" />
        </div>

        <StatusBadge status={document.processingStatus} />
      </div>

      <h2 className="line-clamp-1 text-base font-semibold text-white">
        {document.title}
      </h2>

      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {formatDocumentType(document.documentType)}
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2">
        <CalendarDays className="h-4 w-4 text-slate-500" />

        <p className="text-xs text-slate-400">
          Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
