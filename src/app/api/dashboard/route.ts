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

    const documents = await prisma.medicalDocument.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Fetch documents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch documents",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}