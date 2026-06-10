"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { uploadMedicalDocument } from "../../../lib/document-api";

const documentTypes = [
  { label: "Blood Report", value: "BLOOD_REPORT" },
  { label: "Prescription", value: "PRESCRIPTION" },
  { label: "Scan Report", value: "SCAN_REPORT" },
  { label: "Checkup Report", value: "CHECKUP_REPORT" },
  { label: "Other", value: "OTHER" },
];

export default function UploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("BLOOD_REPORT");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Document title is required.");
      return;
    }

    if (!file) {
      setError("Please select a medical report file.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("documentType", documentType);
      formData.append("file", file);

      const data = await uploadMedicalDocument(formData);

      router.push(`/dashboard/documents/${data.document.id}?process=true`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
            <UploadCloud className="h-4 w-4 text-cyan-300" />
            Medical report upload
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Upload Health Report
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
            Upload blood reports, prescriptions, scans, or checkup documents.
            HealthIQ will store the record and process it with AI to extract
            summaries, abnormal values, and health metrics.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Document Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a clear title and select the report type.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          {error && (
            <div className="mb-5 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
              <p className="text-sm leading-6 text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Document title
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: CBC Blood Report - June 2026"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:bg-slate-950/70"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Document type
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {documentTypes.map((type) => {
                  const isSelected = documentType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setDocumentType(type.value)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        isSelected
                          ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                          : "border-white/10 bg-slate-950/35 text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Upload file
              </label>

              <label
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed p-8 text-center transition ${
                  file
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/15 bg-slate-950/35 hover:border-cyan-300/35 hover:bg-white/[0.04]"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] || null;
                    setFile(selectedFile);
                  }}
                />

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300 transition group-hover:bg-cyan-300 group-hover:text-slate-950">
                  {file ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <UploadCloud className="h-6 w-6" />
                  )}
                </div>

                <p className="text-sm font-medium text-white">
                  {file ? file.name : "Click to upload your medical report"}
                </p>

                <p className="mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Supports images and PDF files. Use a clear scan or screenshot
                  for better AI extraction accuracy.
                </p>
              </label>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="healthiq-primary-button flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Upload & Process with AI
                </>
              )}
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
              <Sparkles className="h-5 w-5" />
            </div>

            <h2 className="text-xl font-semibold text-white">
              What happens after upload?
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-slate-950">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Secure document storage
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The uploaded file is linked to your authenticated account.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-slate-950">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    AI text extraction
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    HealthIQ reads the report and extracts relevant medical text.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-xs font-semibold text-slate-950">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Summary and metrics
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The system generates a simple summary, abnormal value
                    warnings, and dashboard metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold text-white">Upload guidance</h3>
            </div>

            <ul className="space-y-3 text-sm leading-6 text-slate-400">
              <li>Use clear, readable reports for better extraction.</li>
              <li>Avoid blurry screenshots or cropped values.</li>
              <li>PDF and image files are supported.</li>
              <li>AI output is educational and not a clinical diagnosis.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
