import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { UserStatus } from "@/types";
import { getSession } from "@/lib/auth";
import { ApiResponse } from "@/types";

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
    await connectToDatabase();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.status !== UserStatus.PENDING) {
      return NextResponse.json(
        { success: false, error: "Only pending applications can be rejected" },
        { status: 400 }
      );
    }

    user.status = UserStatus.REJECTED;
    await user.save();

    return NextResponse.json({
      success: true,
      data: { id: user._id, status: user.status }
    });
  } catch (error) {
    console.error("[Admin Reject API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reject user" },
      { status: 500 }
    );
  }
}
