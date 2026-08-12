import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";
import { approveUserSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { ApiResponse } from "@/types";
import { calculateExpiryDate } from "@/lib/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // Validate and parse the optional validityDays override
    const validation = approveUserSchema.safeParse(body);
    const validityDays = validation.success ? validation.data.validityDays : 365;

    await connectToDatabase();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.status === UserStatus.ACTIVE) {
      return NextResponse.json({ success: false, error: "User is already active" }, { status: 400 });
    }

    // Generate Unique ID if they don't have one
    if (!user.uniqueId) {
      user.uniqueId = await (User as unknown as { generateUniqueId: (prefix: string) => Promise<string> }).generateUniqueId("PASS");
    }

    // Set dates and status — expiry is calculated from validityDays
    const issueDate = new Date();
    user.issueDate = issueDate;
    user.expiryDate = calculateExpiryDate(issueDate, validityDays);
    user.status = UserStatus.ACTIVE;

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        status: user.status,
        uniqueId: user.uniqueId,
        issueDate: user.issueDate,
        expiryDate: user.expiryDate
      }
    });
  } catch (error) {
    console.error("[Admin Approve API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve user" },
      { status: 500 }
    );
  }
}
