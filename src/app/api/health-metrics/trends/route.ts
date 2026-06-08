import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get("metric");

    if (!metricName) {
      return NextResponse.json(
        {
          success: false,
          message: "Metric name is required. Example: ?metric=Hemoglobin",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: user.id,
        name: {
          equals: metricName,
          mode: "insensitive",
        },
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: {
        testedAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      metric: metricName,
      count: metrics.length,
      trend: metrics.map((metric) => ({
        id: metric.id,
        name: metric.name,
        value: metric.value,
        unit: metric.unit,
        status: metric.status,
        testedAt: metric.testedAt,
        document: metric.document,
      })),
    });
  } catch (error) {
    console.error("Fetch health metric trend error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch health metric trend",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}