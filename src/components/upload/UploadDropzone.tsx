"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import { uploadMedicalDocument } from "../../lib/document-api";

export default function UploadDropzone() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("BLOOD_REPORT");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("documentType", documentType);

    try {
      setIsUploading(true);
      setMessage("");

      const data = await uploadMedicalDocument(formData);
      const documentId = data.document?.id;

      if (!documentId) {
        throw new Error("Upload succeeded, but document ID was not returned.");
      }

      setMessage("Document uploaded successfully. Starting AI processing...");

      router.push(`/dashboard/documents/${documentId}?process=true`);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-muted p-3">
          <UploadCloud className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Upload Medical Document</h2>
          <p className="text-sm text-muted-foreground">
            Supported formats: PDF, PNG, JPG, JPEG
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition hover:bg-muted/50">
          <FileUp className="mb-3 h-10 w-10 text-muted-foreground" />

          <span className="font-medium">
            {file ? file.name : "Click to select a medical report"}
          </span>

          <span className="mt-1 text-sm text-muted-foreground">
            Blood report, prescription, scan, or checkup document
          </span>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setMessage("");
            }}
          />
        </label>

        <div className="space-y-2">
          <label className="text-sm font-medium">Document Type</label>

          <select
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value)}
            className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none"
          >
            <option value="BLOOD_REPORT">Blood Report</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="SCAN_REPORT">Scan Report</option>
            <option value="CHECKUP_REPORT">General Checkup</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {message && (
          <p className="rounded-xl border bg-muted px-4 py-3 text-sm">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload & Analyze
            </>
          )}
        </button>
      </div>
    </div>
  );
}
