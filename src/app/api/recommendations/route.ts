import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../server/utils/require-user";
import { generateRecommendations } from "../../../server/utils/recommendation-engine";


export async function GET() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const abnormalMetrics = await prisma.healthMetric.findMany({
      where: {
        userId: user.id,
        status: {
          in: ["LOW", "HIGH", "CRITICAL", "UNKNOWN"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            documentType: true,
            uploadedAt: true,
          },
        },
      },
    });

    const recommendations = generateRecommendations(
      abnormalMetrics.map((metric) => ({
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        normalMin: metric.normalMin,
        normalMax: metric.normalMax,
        status: metric.status,
      }))
    );

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
      sourceMetrics: abnormalMetrics,
    });
  } catch (error) {
    console.error("Recommendations error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate recommendations",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}