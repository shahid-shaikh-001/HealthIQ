import { ai } from "../../lib/ai";

type MetricStatus = "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN";

type ExtractedMetric = {
  name: string;
  value: number | null;
  unit: string | null;
  normalMin: number | null;
  normalMax: number | null;
  status: MetricStatus;
};

type ParsedMedicalReport = {
  extractedText: string;
  aiSummary: string;
  metrics: ExtractedMetric[];
};

const VALID_STATUSES: MetricStatus[] = [
  "LOW",
  "NORMAL",
  "HIGH",
  "CRITICAL",
  "UNKNOWN",
];

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI did not return valid JSON");
  }

  return cleaned.slice(start, end + 1);
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toNullableString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return String(value);
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeStatus(value: unknown): MetricStatus {
  if (typeof value !== "string") {
    return "UNKNOWN";
  }

  const status = value.toUpperCase() as MetricStatus;

  return VALID_STATUSES.includes(status) ? status : "UNKNOWN";
}

function validateParsedReport(data: unknown): ParsedMedicalReport {
  if (!data || typeof data !== "object") {
    throw new Error("AI response is not an object");
  }

  const report = data as Record<string, unknown>;

  const extractedText =
    typeof report.extractedText === "string"
      ? report.extractedText.trim()
      : "";

  const aiSummary =
    typeof report.aiSummary === "string"
      ? report.aiSummary.trim()
      : "";

  if (!extractedText) {
    throw new Error("AI response missing extractedText");
  }

  if (!aiSummary) {
    throw new Error("AI response missing aiSummary");
  }

  if (!Array.isArray(report.metrics)) {
    throw new Error("AI response missing metrics array");
  }

  const metrics: ExtractedMetric[] = report.metrics
    .map((metric) => {
      if (!metric || typeof metric !== "object") {
        return null;
      }

      const item = metric as Record<string, unknown>;

      const name =
        typeof item.name === "string" ? item.name.trim() : "";

      if (!name) {
        return null;
      }

      return {
        name,
        value: toNullableNumber(item.value),
        unit: toNullableString(item.unit),
        normalMin: toNullableNumber(item.normalMin),
        normalMax: toNullableNumber(item.normalMax),
        status: normalizeStatus(item.status),
      };
    })
    .filter((metric): metric is ExtractedMetric => metric !== null);

  if (metrics.length === 0) {
    throw new Error("AI response did not contain valid metrics");
  }

  return {
    extractedText,
    aiSummary,
    metrics,
  };
}

export async function parseMedicalReportWithAI({
  fileUrl,
  fileType,
}: {
  fileUrl: string;
  fileType: string;
}): Promise<ParsedMedicalReport> {
  const prompt = `
You are a medical report data extraction engine.

Extract structured data from this medical report file URL:

${fileUrl}

File type: ${fileType}

Return ONLY valid JSON. No markdown. No explanation.

JSON schema:
{
  "extractedText": "string",
  "aiSummary": "string",
  "metrics": [
    {
      "name": "string",
      "value": number | null,
      "unit": "string | null",
      "normalMin": number | null,
      "normalMax": number | null,
      "status": "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN"
    }
  ]
}

Rules:
- Extract only values visible in the report.
- Do not invent values.
- If normal range is missing, use null.
- If status cannot be confidently detected, use "UNKNOWN".
- aiSummary must be simple and non-diagnostic.
- Do not give medical advice.
- Do not diagnose diseases.
- Do not recommend medication.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  const text = response.text;

  if (!text) {
    throw new Error("AI returned empty response");
  }

  const json = extractJson(text);
  const parsedJson = JSON.parse(json);

  return validateParsedReport(parsedJson);
}