import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/auth";
import { ApiResponse } from "@/types";
import { UserStatus } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    // Rate limit to prevent brute-force discovery attempts
    const rateLimit = checkRateLimit("admin:seed", 3, 60_000 * 5);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many requests. Try again in ${rateLimit.retryAfter}s.` },
        { status: 429 }
      );
    }

    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "INITIAL_ADMIN_EMAIL or INITIAL_ADMIN_PASSWORD not set in environment" },
        { status: 500 }
      );
    }

    await connectToDatabase();

    // Check if any admin exists — only allow seeding when there are zero admins
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

    // Also migrate any existing ACTIVE users (from Phase 9 auto-ACTIVE flow)
    // that don't have issueDate/expiryDate set — backfill them
    const usersNeedingMigration = await User.find({
      status: UserStatus.ACTIVE,
      $or: [
        { issueDate: { $exists: false } },
        { expiryDate: { $exists: false } },
      ],
    }).exec();

    if (usersNeedingMigration.length > 0) {
      const issueDate = new Date();
      await User.updateMany(
        {
          status: UserStatus.ACTIVE,
          $or: [
            { issueDate: { $exists: false } },
            { expiryDate: { $exists: false } },
          ],
        },
        {
          $set: {
            issueDate,
            expiryDate: new Date("2026-10-31T23:59:59.999Z"),
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Initial admin account created successfully.",
      data: {
        email: admin.email,
        name: admin.name,
        migratedUsers: usersNeedingMigration.length,
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
