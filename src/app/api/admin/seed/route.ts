import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/auth";
import { ApiResponse } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD not set in environment" },
        { status: 500 }
      );
    }

    await connectToDatabase();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, error: "Seed failed: Admin users already exist. This endpoint is for initial setup only." },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(password);

    const admin = await Admin.create({
      email,
      passwordHash,
      name: "System Administrator",
    });

    return NextResponse.json({
      success: true,
      message: "Initial admin account created successfully.",
      data: {
        email: admin.email,
        name: admin.name,
      }
    });
  } catch (error) {
    console.error("[Seed API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
