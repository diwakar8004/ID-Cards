import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyPassword, createSessionToken, setSessionCookie, checkRateLimit } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";
import { ApiResponse } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Basic rate limiting by IP (using x-forwarded-for or fallback)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60_000 * 5); // 5 attempts per 5 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Try again in ${rateLimit.retryAfter}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = adminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    await connectToDatabase();

    // Find admin by email (explicitly selecting passwordHash since it's select: false in model)
    const admin = await Admin.findOne({ email }).select("+passwordHash");

    if (!admin) {
      // Return generic error to prevent email enumeration
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const token = createSessionToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    });

    // Set cookie
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        adminId: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("[Login API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
