import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.EXPIRED) {
      return NextResponse.json(
        { success: false, error: "Only active or expired passes can be revoked" },
        { status: 400 }
      );
    }

    user.status = UserStatus.REVOKED;
    await user.save();

    return NextResponse.json({
      success: true,
      data: { id: user._id, status: user.status }
    });
  } catch (error) {
    console.error("[Admin Revoke API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revoke user" },
      { status: 500 }
    );
  }
}
