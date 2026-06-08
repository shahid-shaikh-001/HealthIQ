import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../server/utils/require-user";

export async function GET() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      latestHealthScore,
      recentDocuments,
      recentMetrics,
      abnormalMetrics,
      documentCount,
      metricCount,
    ] = await Promise.all([
      prisma.healthScore.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          calculatedAt: "desc",
        },
      }),

      prisma.medicalDocument.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          uploadedAt: "desc",
        },
        take: 5,
      }),

      prisma.healthMetric.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
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
      }),

      prisma.healthMetric.findMany({
        where: {
          userId: user.id,
          status: {
            in: ["LOW", "HIGH", "CRITICAL"],
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
      }),

      prisma.medicalDocument.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.healthMetric.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      dashboard: {
        user,
        stats: {
          documentCount,
          metricCount,
          abnormalMetricCount: abnormalMetrics.length,
        },
        latestHealthScore,
        recentDocuments,
        recentMetrics,
        abnormalMetrics,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}