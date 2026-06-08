import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { parseMockMedicalReport } from "../../../../../server/utils/medical-mock-parser";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.upsert({
      where: {
        email: session.user.email,
      },
      update: {
        name: session.user.name,
        image: session.user.image,
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      select: {
        id: true,
      },
    });

    const document = await prisma.medicalDocument.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
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

    const parsedReport = parseMockMedicalReport();

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
        testedAt: metric.testedAt,
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