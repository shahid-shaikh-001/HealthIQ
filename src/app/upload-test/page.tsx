"use client";

import { useState } from "react";

export default function UploadTestPage() {
  const [message, setMessage] = useState("");

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setMessage(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Upload Test</h1>

      <form onSubmit={handleUpload}>
        <input name="title" placeholder="Document title" required />

        <br />
        <br />

        <select name="documentType" defaultValue="BLOOD_REPORT">
          <option value="BLOOD_REPORT">Blood Report</option>
          <option value="PRESCRIPTION">Prescription</option>
          <option value="SCAN_REPORT">Scan Report</option>
          <option value="CHECKUP_REPORT">Checkup Report</option>
          <option value="OTHER">Other</option>
        </select>

        <br />
        <br />

        <input name="file" type="file" required />

        <br />
        <br />

        <button type="submit">Upload</button>
      </form>

      <pre>{message}</pre>
    </main>
  );
}