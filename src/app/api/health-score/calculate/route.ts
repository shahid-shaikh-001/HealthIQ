import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { calculateHealthScore } from "../../../../server/utils/health-score-engine";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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