/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/documents"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to documents
      </Link>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-muted p-3">
                <FileText className="h-5 w-5" />
              </div>

              <StatusBadge status={document.processingStatus} />

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {document.documentType.replace("_", " ")}
              </span>
            </div>

            <h1 className="text-3xl font-bold">{document.title}</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {canProcess && (
              <button
                type="button"
                onClick={handleProcessDocument}
                disabled={isProcessing || isDeleting || isUpdating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit document</DialogTitle>
                  <DialogDescription>
                    Update the document title and document type.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      placeholder="Enter document title"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Document Type</label>
                    <select
                      value={editDocumentType}
                      onChange={(event) =>
                        setEditDocumentType(event.target.value)
                      }
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none"
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
                    className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateDocument}
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Open File
              <ExternalLink className="h-4 w-4" />
            </a>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isDeleting || isProcessing || isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950"
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

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete document?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this medical document and its
                    extracted health metrics. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
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
          <div className="mt-5 rounded-xl border bg-muted px-4 py-3 text-sm text-muted-foreground">
            {processMessage}
          </div>
        )}

        {document.processingStatus === "PENDING" && (
          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-300">
            This document is uploaded but not analyzed yet. Click Process with AI to extract text, summary, and health metrics.
          </div>
        )}

        {document.processingStatus === "PROCESSING" && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            AI processing is in progress. This may take a few seconds depending on file size and AI provider response time.
          </div>
        )}

        {document.processingStatus === "FAILED" && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            AI processing failed. This can happen if the AI provider is temporarily overloaded or unavailable. You can retry processing this document.
          </div>
        )}

        {document.processingStatus === "COMPLETED" && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            AI processing completed. Extracted text, summary, and health metrics are available below.
          </div>
        )}
      </div>

      {document.healthMetrics && document.healthMetrics.length > 0 && (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Extracted Health Metrics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Metric</th>
                  <th className="py-3 pr-4 font-medium">Value</th>
                  <th className="py-3 pr-4 font-medium">Reference Range</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {document.healthMetrics.map((metric) => (
                  <tr key={metric.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{metric.name}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {metric.value} {metric.unit}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {metric.normalMin ?? "N/A"} - {metric.normalMax ?? "N/A"}{" "}
                      {metric.unit}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
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
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Extracted Text</h2>
          </div>

          <div className="max-h-[500px] overflow-y-auto rounded-xl bg-muted p-4">
            <pre className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {document.extractedText || "No extracted text available yet."}
            </pre>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-semibold">AI Summary</h2>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {document.aiSummary || "AI summary is not available yet."}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
