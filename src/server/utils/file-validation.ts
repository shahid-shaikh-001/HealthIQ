const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export function validateMedicalFile(file: File): {
  valid: boolean;
  message?: string;
} {
  if (!file) {
    return {
      valid: false,
      message: "File is required",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      message: "File is empty",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: "File size must be less than 10MB",
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: "Only PDF, PNG, JPG, and JPEG files are allowed",
    };
  }

  return {
    valid: true,
  };
}