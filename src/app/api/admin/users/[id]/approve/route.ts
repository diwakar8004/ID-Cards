import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";
import { calculateExpiryDate } from "@/lib/utils";
import { approveUserSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // Allow overriding default validity days
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
      user.uniqueId = await (User as any).generateUniqueId("PASS");
    }

    // Set dates and status
    user.issueDate = new Date();
    user.expiryDate = calculateExpiryDate(user.issueDate, validityDays);
    user.status = UserStatus.ACTIVE;

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
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
