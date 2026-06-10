"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Plus,
  UploadCloud,
} from "lucide-react";

import DocumentCard from "../../../components/documents/DocumentCard";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingState from "../../../components/shared/LoadingState";
import { getDocuments } from "../../../lib/document-api";

type MedicalDocument = {
  id: string;
  title: string;
  fileType?: string;
  documentType: string;
  processingStatus: string;
  uploadedAt: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load documents"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      completed: documents.filter(
        (document) => document.processingStatus === "COMPLETED"
      ).length,
      pending: documents.filter(
        (document) =>
          document.processingStatus === "PENDING" ||
          document.processingStatus === "PROCESSING"
      ).length,
      failed: documents.filter(
        (document) => document.processingStatus === "FAILED"
      ).length,
    };
  }, [documents]);

  if (isLoading) {
    return (
      <LoadingState
        title="Loading documents"
        description="Fetching your uploaded medical records."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load documents"
        description={error}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <FileText className="h-4 w-4 text-cyan-300" />
            Medical document workspace
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Documents
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Manage uploaded health reports, process them with AI, and review
            extracted summaries and biomarkers.
          </p>
        </div>

        <Link
          href="/dashboard/upload"
          className="healthiq-primary-button inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          <Plus className="h-4 w-4" />
          Upload Report
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">Total Documents</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.total}</p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {stats.completed}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-300/10 text-yellow-300">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-300/10 text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">Failed</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stats.failed}</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl">
          <EmptyState
            icon={FileText}
            title="No documents uploaded yet"
            description="Upload your first medical report to begin extracting health insights."
          />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
