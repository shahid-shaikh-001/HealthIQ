export async function uploadMedicalDocument(formData: FormData) {
  const response = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Document upload failed");
  }

  return data;
}

export async function getDocuments() {
  const response = await fetch("/api/documents", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents");
  }

  return data.documents || [];
}

export async function getDocumentById(id: string) {
  const response = await fetch(`/api/documents/${id}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch document");
  }

  return data.document;
}

export async function processDocument(id: string) {
  const response = await fetch(`/api/documents/${id}/process`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Document processing failed");
  }

  return data.document;
}

export async function deleteDocument(id: string) {
  const response = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Document deletion failed");
  }

  return data;
}

export async function updateDocument(
  id: string,
  payload: {
    title: string;
    documentType: string;
  }
) {
  const response = await fetch(`/api/documents/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Document update failed");
  }

  return data.document;
}
