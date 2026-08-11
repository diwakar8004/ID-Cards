import { v2 as cloudinary } from "cloudinary";

// ============================================================
// Cloud Storage — Cloudinary
// ============================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Allowed MIME types for photo upload
export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export type AllowedPhotoType = (typeof ALLOWED_PHOTO_TYPES)[number];

// Maximum file size: 5MB
export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload a photo buffer to Cloudinary.
 * Returns the secure URL and public ID.
 */
export async function uploadPhoto(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: object[];
  } = {}
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder ?? "idverify/photos",
      public_id: options.publicId,
      resource_type: "image" as const,
      transformation: options.transformation ?? [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) {
          reject(
            new Error(
              error?.message ?? "Failed to upload photo to cloud storage"
            )
          );
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    stream.end(buffer);
  });
}

/**
 * Delete a photo from Cloudinary by public ID.
 */
export async function deletePhoto(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("[Cloudinary] Delete failed:", error);
    return false;
  }
}

/**
 * Validate that an uploaded file is an acceptable photo.
 * Returns an error message or null if valid.
 */
export function validatePhotoFile(
  mimeType: string,
  sizeBytes: number
): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(mimeType as AllowedPhotoType)) {
    return `Invalid file type. Allowed types: ${ALLOWED_PHOTO_TYPES.join(", ")}`;
  }
  if (sizeBytes > MAX_PHOTO_SIZE_BYTES) {
    return `File size must be under 5MB. Current size: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB`;
  }
  return null;
}

/**
 * Extract the Cloudinary public ID from a secure URL.
 */
export function extractPublicId(secureUrl: string): string {
  try {
    const url = new URL(secureUrl);
    const pathParts = url.pathname.split("/");
    // Remove version segment (v1234567) if present
    const uploadIndex = pathParts.indexOf("upload");
    const relevantParts = pathParts.slice(uploadIndex + 1);
    if (relevantParts[0]?.startsWith("v")) {
      relevantParts.shift();
    }
    // Remove file extension
    const withoutExtension = relevantParts.join("/").replace(/\.[^.]+$/, "");
    return withoutExtension;
  } catch {
    return secureUrl;
  }
}
