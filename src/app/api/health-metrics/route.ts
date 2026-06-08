import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireUser } from "../../../server/utils/require-user";

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

    const status = searchParams.get("status");
    const name = searchParams.get("name");

    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: user.id,
        ...(status
          ? {
              status: status as any,
            }
          : {}),
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