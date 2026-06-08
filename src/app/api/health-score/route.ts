import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
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