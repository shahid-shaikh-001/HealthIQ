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

    const healthScore = await prisma.healthScore.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        calculatedAt: "desc",
      },
    });

    if (!healthScore) {
      return NextResponse.json({
        success: true,
        healthScore: null,
        message: "No health score calculated yet",
      });
    }

    return NextResponse.json({
      success: true,
      healthScore,
    });
  } catch (error) {
    console.error("Fetch health score error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch health score",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}