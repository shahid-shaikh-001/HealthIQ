import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { cloudinary } from "../../../../lib/cloudinary";
import { requireUser } from "../../../../server/utils/require-user";
import { validateMedicalFile } from "../../../../server/utils/file-validation";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  secure_url: string;
  resource_type: string;
  format: string;
  bytes: number;
};

function safeFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();
}

async function uploadToCloudinary(buffer: Buffer, fileName: string) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "healthiq/documents",
        resource_type: "auto",
        public_id: `${Date.now()}-${safeFileName(fileName)}`,
      },
      (error, result) => {
        if (error) {
          reject(new Error(JSON.stringify(error)));
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed: No result returned"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          format: result.format || "unknown",
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const title = formData.get("title");
    const documentType = formData.get("documentType");
        
    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 }
      );
    }
    
    const fileValidation = validateMedicalFile(file);
    
    if (!fileValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: fileValidation.message,
        },
        { status: 400 }
      );
    }
    
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "BLOOD_REPORT",
      "PRESCRIPTION",
      "SCAN_REPORT",
      "CHECKUP_REPORT",
      "OTHER",
    ];

    const finalDocumentType =
      typeof documentType === "string" && allowedTypes.includes(documentType)
        ? documentType
        : "OTHER";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedFile = await uploadToCloudinary(buffer, file.name);

    const document = await prisma.medicalDocument.create({
      data: {
        userId: user.id,
        title,
        fileUrl: uploadedFile.secure_url,
        fileType: file.type || uploadedFile.format || "unknown",
        fileSize: uploadedFile.bytes,
        documentType: finalDocumentType as any,
        processingStatus: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        document,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);

    console.error("Document upload error:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: "Document upload failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}