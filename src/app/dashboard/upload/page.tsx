import UploadDropzone from "../../../components/upload/UploadDropzone";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Report</h1>
        <p className="text-muted-foreground">
          Upload medical documents for AI extraction, analysis, and health tracking.
        </p>
      </div>

      <UploadDropzone />
    </div>
  );
}
