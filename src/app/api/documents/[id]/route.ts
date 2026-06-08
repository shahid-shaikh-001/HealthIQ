import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireUser } from "../../../../server/utils/require-user";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const document = await prisma.medicalDocument.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        healthMetrics: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Fetch document error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch document",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { title, documentType } = body;

    const allowedDocumentTypes = [
      "BLOOD_REPORT",
      "PRESCRIPTION",
      "SCAN_REPORT",
      "CHECKUP_REPORT",
      "OTHER",
    ];

    if (title !== undefined && typeof title !== "string") {
      return NextResponse.json(
        { success: false, message: "Title must be a string" },
        { status: 400 }
      );
    }

    if (
      documentType !== undefined &&
      !allowedDocumentTypes.includes(documentType)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid documentType. Allowed values: BLOOD_REPORT, PRESCRIPTION, SCAN_REPORT, CHECKUP_REPORT, OTHER",
        },
        { status: 400 }
      );
    }

    const existingDocument = await prisma.medicalDocument.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    const updatedDocument = await prisma.medicalDocument.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(documentType !== undefined ? { documentType } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Update document error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update document",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingDocument = await prisma.medicalDocument.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.medicalDocument.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete document",
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}