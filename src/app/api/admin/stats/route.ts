import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";
import { getSession } from "@/lib/auth";
import { ApiResponse } from "@/types";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    // Require authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalUsers,
      pendingApplications,
      activeIds,
      expiredIds,
      revokedIds,
      rejectedApplications,
      recentRegistrations
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: UserStatus.PENDING }),
      User.countDocuments({ status: UserStatus.ACTIVE }),
      User.countDocuments({ status: UserStatus.EXPIRED }),
      User.countDocuments({ status: UserStatus.REVOKED }),
      User.countDocuments({ status: UserStatus.REJECTED }),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        pendingApplications,
        activeIds,
        expiredIds,
        revokedIds,
        rejectedApplications,
        approvedIds: activeIds + expiredIds + revokedIds, // All historically approved
        recentRegistrations
      }
    });
  } catch (error) {
    console.error("[Admin Stats API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
