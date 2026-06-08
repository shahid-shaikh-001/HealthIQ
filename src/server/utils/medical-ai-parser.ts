import { ai } from "../../lib/ai";

type ExtractedMetric = {
  name: string;
  value: number | null;
  unit: string | null;
  normalMin: number | null;
  normalMax: number | null;
  status: "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN";
};

type ParsedMedicalReport = {
  extractedText: string;
  aiSummary: string;
  metrics: ExtractedMetric[];
};

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
  const parsed = JSON.parse(json) as ParsedMedicalReport;

  if (!parsed.metrics || !Array.isArray(parsed.metrics)) {
    throw new Error("AI response missing metrics array");
  }

  return parsed;
}