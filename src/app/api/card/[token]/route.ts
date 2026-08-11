import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// ============================================================
// Public Card Data Endpoint — Phase 9
// Returns ONLY the sanitized fields required to render the
// IDCard component. No private/user-registration data is ever
// exposed. This mirrors the field-selection approach already
// used by /api/verify/[token].
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || token.length < 16) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by verificationToken — only select fields
    // that are rendered on the public card (same set as /verify)
    const user = await User.findOne({ verificationToken: token }).select(
      "fullName photoUrl uniqueId organizationName organizationType department designation issueDate expiryDate status verificationToken"
    ).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Card not found" },
        { status: 404 }
      );
    }

    // Sanitized public card data — no email, phone, address, or
    // internal MongoDB fields are included.
    const publicCard = {
      fullName: user.fullName,
      photoUrl: user.photoUrl,
      uniqueId: user.uniqueId,
      organizationName: user.organizationName,
      organizationType: user.organizationType,
      department: user.department,
      designation: user.designation,
      issueDate: user.issueDate,
      expiryDate: user.expiryDate,
      status: user.status,
      verificationToken: user.verificationToken,
    };

    return NextResponse.json({
      success: true,
      data: publicCard,
    });
  } catch (error) {
    console.error("[Card API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Card retrieval failed" },
      { status: 500 }
    );
  }
}
