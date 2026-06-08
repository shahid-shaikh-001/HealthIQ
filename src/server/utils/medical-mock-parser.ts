export type MockHealthMetric = {
  name: string;
  value: number;
  unit: string;
  normalMin: number;
  normalMax: number;
  status: "LOW" | "NORMAL" | "HIGH" | "CRITICAL" | "UNKNOWN";
  testedAt: Date;
};

export function parseMockMedicalReport(): {
  extractedText: string;
  aiSummary: string;
  metrics: MockHealthMetric[];
} {
  const testedAt = new Date();

  return {
    extractedText:
      "Mock extracted report text. Hemoglobin: 13.5 g/dL, WBC: 7200 cells/uL, Platelets: 250000 cells/uL, Glucose: 92 mg/dL.",

    aiSummary:
      "The uploaded report appears mostly normal based on mock analysis. Hemoglobin, WBC, platelets, and glucose are within standard reference ranges.",

    metrics: [
      {
        name: "Hemoglobin",
        value: 13.5,
        unit: "g/dL",
        normalMin: 13,
        normalMax: 17,
        status: "NORMAL",
        testedAt,
      },
      {
        name: "WBC",
        value: 7200,
        unit: "cells/uL",
        normalMin: 4000,
        normalMax: 11000,
        status: "NORMAL",
        testedAt,
      },
      {
        name: "Platelets",
        value: 250000,
        unit: "cells/uL",
        normalMin: 150000,
        normalMax: 450000,
        status: "NORMAL",
        testedAt,
      },
      {
        name: "Glucose",
        value: 92,
        unit: "mg/dL",
        normalMin: 70,
        normalMax: 100,
        status: "NORMAL",
        testedAt,
      },
    ],
  };
}