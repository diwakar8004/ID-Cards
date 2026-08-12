import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { uploadPhoto, validatePhotoFile } from "@/lib/storage";
import { registrationSchema } from "@/lib/validation";
import { UserStatus, OrganizationType } from "@/types";
import { checkRateLimit } from "@/lib/auth";
import { calculateExpiryDate } from "@/lib/utils";
import crypto from "crypto";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Rate limiting (prevent spam registrations)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`register:${ip}`, 3, 60_000 * 15); // 3 registrations per 15 min

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rateLimit.retryAfter}s.` },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    
    // Extract text fields
    const payload = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      organizationName: formData.get("organizationName")?.toString() || "",
      organizationType: formData.get("organizationType")?.toString() as OrganizationType || OrganizationType.OTHER,
      department: formData.get("department")?.toString() || "",
      designation: formData.get("designation")?.toString() || "",
    };

    // Extract photo
    const photoFile = formData.get("photo") as File | null;

    if (!photoFile) {
      return NextResponse.json(
        { success: false, error: "A clear ID photo is required." },
        { status: 400 }
      );
    }

    // 3. Validate Text Data via Zod
    const validation = registrationSchema.safeParse(payload);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0]?.message || "Invalid input data." },
        { status: 400 }
      );
    }

    // 4. Validate Photo
    const photoError = validatePhotoFile(photoFile.type, photoFile.size);
    if (photoError) {
      return NextResponse.json(
        { success: false, error: photoError },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 5. Check if email already exists
    const existingUser = await User.findOne({ email: validation.data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An application with this email already exists." },
        { status: 409 }
      );
    }

    // 6. Upload Photo to Cloudinary
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const uploadResult = await uploadPhoto(buffer, {
      folder: "idverify/pending_photos",
    });

    // 7. Construct and validate fullName server-side
    const fullName = [validation.data.firstName, validation.data.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Full name is required." },
        { status: 400 }
      );
    }

    // 8. Generate uniqueId, dates, and secure verification token
    const uniqueId = await (User as unknown as { generateUniqueId: (prefix: string) => Promise<string> }).generateUniqueId("PASS");
    const issueDate = new Date();
    const expiryDate = calculateExpiryDate(issueDate); // Default 365 days from issue
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      ...validation.data,
      fullName: fullName,
      photoUrl: uploadResult.secureUrl,
      uniqueId,
      issueDate,
      expiryDate,
      status: UserStatus.ACTIVE,
      verificationToken,
    });

    // 9. Return success (excluding internal IDs and private fields)
    return NextResponse.json({
      success: true,
      message: "Builder Social Card generated successfully.",
      data: {
        verificationToken,
        uniqueId: newUser.uniqueId,
        status: newUser.status,
      },
    });

  } catch (error) {
    console.error("[Register API] Error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
