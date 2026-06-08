import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireUser } from "../../../../server/utils/require-user";
import { calculateHealthScore } from "../../../../server/utils/health-score-engine";

export async function POST() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const metrics = await prisma.healthMetric.findMany({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
      },
    });

    const result = calculateHealthScore(metrics);

    const healthScore = await prisma.healthScore.create({
      data: {
        userId: user.id,
        score: result.score,
        riskLevel: result.riskLevel,
        summary: result.summary,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Health score calculated successfully",
      healthScore,
    });
  } catch (error) {
    console.error("Calculate health score error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate health score",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}