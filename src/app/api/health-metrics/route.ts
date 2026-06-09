import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../server/utils/require-user";

const allowedMetricStatuses = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;

type MetricStatus = (typeof allowedMetricStatuses)[number];

function isMetricStatus(status: string): status is MetricStatus {
  return allowedMetricStatuses.includes(status as MetricStatus);
}

export async function GET(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status");
    const name = searchParams.get("name");

    if (statusParam && !isMetricStatus(statusParam)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Allowed values: LOW, NORMAL, HIGH, CRITICAL",
        },
        { status: 400 }
      );
    }

    const statusFilter: MetricStatus | undefined =
      statusParam && isMetricStatus(statusParam) ? statusParam : undefined;

    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: user.id,
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(name
          ? {
              name: {
                contains: name,
                mode: "insensitive",
              },
            }
          : {}),
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
      orderBy: {
        testedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: metrics.length,
      metrics,
    });
  } catch (error) {
    console.error("Fetch health metrics error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch health metrics",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
