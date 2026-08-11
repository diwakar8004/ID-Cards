import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import VerificationLog from "@/models/VerificationLog";
import { VerificationResult, UserStatus } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token }).lean();

    if (!user) {
      // Log failed verification
      await VerificationLog.create({
        verificationToken: token,
        uniqueId: "UNKNOWN",
        result: VerificationResult.NOT_FOUND,
        status: "INVALID"
      });

      return NextResponse.json(
        { success: false, error: "Invalid pass or pass not found" },
        { status: 404 }
      );
    }

    // Determine current effective status (e.g., auto-expire if past expiryDate)
    let effectiveStatus = user.status;
    if (user.status === UserStatus.ACTIVE && user.expiryDate) {
      const now = new Date();
      if (new Date(user.expiryDate) < now) {
        effectiveStatus = UserStatus.EXPIRED;
        // Optionally update the DB here, but fine to just return it for now
      }
    }

    // Log successful verification lookup
    await VerificationLog.create({
      verificationToken: token,
      uniqueId: user.uniqueId || "PENDING",
      result: VerificationResult.FOUND,
      status: effectiveStatus
    });

    // Strip sensitive info
    const publicUser = {
      fullName: user.fullName,
      photoUrl: user.photoUrl,
      uniqueId: user.uniqueId,
      organizationName: user.organizationName,
      organizationType: user.organizationType,
      department: user.department,
      designation: user.designation,
      issueDate: user.issueDate,
      expiryDate: user.expiryDate,
      status: effectiveStatus
    };

    return NextResponse.json({
      success: true,
      data: {
        isValid: effectiveStatus === UserStatus.ACTIVE,
        status: effectiveStatus,
        user: publicUser,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[Verify API] Error:", error);
    
    // Log error if possible
    try {
      const { token } = await params;
      await VerificationLog.create({
        verificationToken: token,
        uniqueId: "ERROR",
        result: VerificationResult.ERROR,
        status: "INVALID"
      });
    } catch (e) {
      // ignore nested error
    }

    return NextResponse.json(
      { success: false, error: "Verification system error" },
      { status: 500 }
    );
  }
}
