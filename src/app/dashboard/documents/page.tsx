"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">
          View uploaded medical reports and AI processing status.
        </p>
      </div>

      {isLoading && (
        <LoadingState
          title="Loading documents"
          description="Fetching your uploaded medical records."
        />
      )}

      {!isLoading && error && (
        <ErrorState
          title="Failed to load documents"
          description={error}
        />
      )}

      {!isLoading && !error && documents.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No documents uploaded yet"
          description="Upload your first medical report to start health analysis."
        />
      )}

      {!isLoading && !error && documents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
