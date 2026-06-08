import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireUser } from "../../../../../server/utils/require-user";
import { parseMedicalReportWithAI } from "../../../../../server/utils/medical-ai-parser";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const document = await prisma.medicalDocument.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        fileUrl: true,
        fileType: true,
        processingStatus: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.medicalDocument.update({
      where: {
        id: document.id,
      },
      data: {
        processingStatus: "PROCESSING",
      },
    });

    const parsedReport = await parseMedicalReportWithAI({
      fileUrl: document.fileUrl,
      fileType: document.fileType,
    });

    await prisma.healthMetric.deleteMany({
      where: {
        documentId: document.id,
      },
    });

    await prisma.healthMetric.createMany({
      data: parsedReport.metrics.map((metric) => ({
        userId: user.id,
        documentId: document.id,
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        normalMin: metric.normalMin,
        normalMax: metric.normalMax,
        status: metric.status,
        testedAt: new Date(),
      })),
    });

    const updatedDocument = await prisma.medicalDocument.update({
      where: {
        id: document.id,
      },
      data: {
        extractedText: parsedReport.extractedText,
        aiSummary: parsedReport.aiSummary,
        processingStatus: "COMPLETED",
      },
      include: {
        healthMetrics: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document processed successfully",
      document: updatedDocument,
    });
  } catch (error) {
    await prisma.medicalDocument
      .update({
        where: {
          id,
        },
        data: {
          processingStatus: "FAILED",
        },
      })
      .catch(() => null);

    console.error("Document processing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Document processing failed",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}