/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";

import {
  deleteDocument,
  getDocumentById,
  processDocument,
  updateDocument,
} from "../../../../lib/document-api";
import ErrorState from "../../../../components/shared/ErrorState";
import LoadingState from "../../../../components/shared/LoadingState";
import StatusBadge from "../../../../components/shared/StatusBadge";
import { calculateHealthScore } from "../../../../lib/health-score-api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";

type HealthMetric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalMin: number | null;
  normalMax: number | null;
  status: string;
};

type MedicalDocument = {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  documentType: string;
  processingStatus: string;
  extractedText?: string | null;
  aiSummary?: string | null;
  uploadedAt: string;
  healthMetrics?: HealthMetric[];
};

const documentTypes = [
  { label: "Blood Report", value: "BLOOD_REPORT" },
  { label: "Prescription", value: "PRESCRIPTION" },
  { label: "Scan Report", value: "SCAN_REPORT" },
  { label: "Checkup Report", value: "CHECKUP_REPORT" },
  { label: "Other", value: "OTHER" },
];

function formatDocumentType(type: string) {
  return type.replaceAll("_", " ");
}

function getMetricStatusClass(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "NORMAL") {
    return "border-emerald-300/20 bg-emerald-500/10 text-emerald-300";
  }

  if (normalized === "LOW" || normalized === "HIGH" || normalized === "ABNORMAL") {
    return "border-red-300/20 bg-red-500/10 text-red-300";
  }

  return "border-yellow-300/20 bg-yellow-500/10 text-yellow-300";
}

function getProcessingMessage(status: string) {
  if (status === "PENDING") {
    return {
      icon: AlertCircle,
      className: "border-yellow-300/20 bg-yellow-500/10 text-yellow-200",
      message:
        "This document is uploaded but not analyzed yet. Click Process with AI to extract text, summary, and health metrics.",
    };
  }

  if (status === "PROCESSING") {
    return {
      icon: Loader2,
      className: "border-cyan-300/20 bg-cyan-500/10 text-cyan-200",
      message:
        "AI processing is in progress. This may take a few seconds depending on file size and AI provider response time.",
    };
  }

  if (status === "FAILED") {
    return {
      icon: AlertCircle,
      className: "border-red-300/20 bg-red-500/10 text-red-200",
      message:
        "AI processing failed. This can happen if the AI provider is temporarily overloaded or unavailable. You can retry processing this document.",
    };
  }

  return {
    icon: CheckCircle2,
    className: "border-emerald-300/20 bg-emerald-500/10 text-emerald-200",
    message:
      "AI processing completed. Extracted text, summary, and health metrics are available below.",
  };
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = params.id as string;
  const shouldAutoProcess = searchParams.get("process") === "true";

  const [document, setDocument] = useState<MedicalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [hasAutoProcessed, setHasAutoProcessed] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDocumentType, setEditDocumentType] = useState("OTHER");

  const [error, setError] = useState("");
  const [processMessage, setProcessMessage] = useState("");

  async function loadDocument() {
    try {
      setError("");
      const data = await getDocumentById(documentId);
      setDocument(data);
      setEditTitle(data.title);
      setEditDocumentType(data.documentType);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load document"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleProcessDocument() {
    if (!documentId) return;

    try {
      setIsProcessing(true);
      setProcessMessage("");

      const updatedDocument = await processDocument(documentId);
      await calculateHealthScore();

      setDocument(updatedDocument);
      setEditTitle(updatedDocument.title);
      setEditDocumentType(updatedDocument.documentType);
      setProcessMessage("Document processed successfully. Health score recalculated.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Document processing failed.";

      setProcessMessage(
        errorMessage.includes("high demand") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("503")
          ? "AI provider is temporarily unavailable or overloaded. Please retry after some time."
          : errorMessage
      );

      await loadDocument();
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleUpdateDocument() {
    if (!documentId) return;

    if (!editTitle.trim()) {
      setProcessMessage("Document title is required.");
      return;
    }

    try {
      setIsUpdating(true);
      setProcessMessage("");

      const updatedDocument = await updateDocument(documentId, {
        title: editTitle.trim(),
        documentType: editDocumentType,
      });

      setDocument((current) =>
        current
          ? {
              ...current,
              title: updatedDocument.title,
              documentType: updatedDocument.documentType,
            }
          : updatedDocument
      );

      setEditTitle(updatedDocument.title);
      setEditDocumentType(updatedDocument.documentType);
      setIsEditOpen(false);
      setProcessMessage("Document updated successfully.");
      router.refresh();
    } catch (error) {
      setProcessMessage(
        error instanceof Error ? error.message : "Document update failed."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteDocument() {
    if (!documentId) return;

    try {
      setIsDeleting(true);
      await deleteDocument(documentId);
      router.push("/dashboard/documents");
      router.refresh();
    } catch (error) {
      setProcessMessage(
        error instanceof Error ? error.message : "Document deletion failed."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (documentId) {
      loadDocument();
    }
  }, [documentId]);

  useEffect(() => {
    if (!document) return;
    if (!shouldAutoProcess) return;
    if (hasAutoProcessed) return;
    if (document.processingStatus !== "PENDING") return;

    const processKey = `healthiq-process-${documentId}`;

    if (sessionStorage.getItem(processKey)) {
      router.replace(`/dashboard/documents/${documentId}`);
      return;
    }

    sessionStorage.setItem(processKey, "true");
    setHasAutoProcessed(true);
    handleProcessDocument();

    router.replace(`/dashboard/documents/${documentId}`);
  }, [document, shouldAutoProcess, hasAutoProcessed, documentId, router]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading document"
        description="Fetching document details and AI analysis data."
      />
    );
  }

  if (error || !document) {
    return (
      <ErrorState
        title="Document not found"
        description={error || "This document does not exist."}
      />
    );
  }

  const canProcess =
    document.processingStatus === "PENDING" ||
    document.processingStatus === "FAILED";

  const processingInfo = getProcessingMessage(
    isProcessing ? "PROCESSING" : document.processingStatus
  );
  const ProcessingIcon = processingInfo.icon;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/documents"
        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-300 shadow-lg shadow-black/10 backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] transition group-hover:-translate-x-0.5 group-hover:bg-cyan-300/10 group-hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" />
        </span>
        <span className="pr-2">Back to documents</span>
      </Link>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <FileText className="h-5 w-5" />
              </div>

              <StatusBadge status={isProcessing ? "PROCESSING" : document.processingStatus} />

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {formatDocumentType(document.documentType)}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {document.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
              </span>

              {document.fileSize && (
                <span>
                  {(document.fileSize / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-wrap lg:justify-end">
            {canProcess && (
              <button
                type="button"
                onClick={handleProcessDocument}
                disabled={isProcessing || isDeleting || isUpdating}
                className="healthiq-primary-button inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <WandSparkles className="h-4 w-4" />
                    {document.processingStatus === "FAILED"
                      ? "Retry AI Processing"
                      : "Process with AI"}
                  </>
                )}
              </button>
            )}

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  disabled={isDeleting || isProcessing || isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
              </DialogTrigger>

              <DialogContent className="border-white/10 bg-slate-950 text-white">
                <DialogHeader>
                  <DialogTitle>Edit document</DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Update the document title and document type.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Title
                    </label>

                    <input
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      placeholder="Enter document title"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Document Type
                    </label>

                    <select
                      value={editDocumentType}
                      onChange={(event) =>
                        setEditDocumentType(event.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"
                    >
                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isUpdating}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateDocument}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Open File
              <ExternalLink className="h-4 w-4" />
            </a>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isDeleting || isProcessing || isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete document?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-500">
                    This will permanently delete this medical document and its
                    extracted health metrics. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={isDeleting}
                    className="border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleDeleteDocument}
                    disabled={isDeleting}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Document"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {processMessage && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300">
            {processMessage}
          </div>
        )}
      </section>

      <section className={`rounded-[1.5rem] border p-5 ${processingInfo.className}`}>
        <div className="flex gap-3">
          <ProcessingIcon
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              isProcessing ? "animate-spin" : ""
            }`}
          />

          <p className="text-sm leading-6">{processingInfo.message}</p>
        </div>
      </section>

      {document.healthMetrics && document.healthMetrics.length > 0 && (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-semibold text-white">
                Extracted Health Metrics
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Structured biomarker values detected from this document.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
              {document.healthMetrics.length} metrics
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-slate-950/60">
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3 font-medium">Metric</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Reference Range</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {document.healthMetrics.map((metric) => (
                  <tr
                    key={metric.id}
                    className="border-t border-white/10 text-slate-300"
                  >
                    <td className="px-4 py-4 font-medium text-white">
                      {metric.name}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {metric.value} {metric.unit}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {metric.normalMin ?? "N/A"} - {metric.normalMax ?? "N/A"}{" "}
                      {metric.unit}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getMetricStatusClass(
                          metric.status
                        )}`}
                      >
                        {metric.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Extracted Text
              </h2>

              <p className="text-sm text-slate-500">
                Raw text detected from the uploaded report.
              </p>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/45 p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
              {document.extractedText || "No extracted text available yet."}
            </pre>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">AI Summary</h2>

              <p className="text-sm text-slate-500">
                Plain-language explanation generated from this document.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm leading-7 text-slate-400">
              {document.aiSummary || "AI summary is not available yet."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
