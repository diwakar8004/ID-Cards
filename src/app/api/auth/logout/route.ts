import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { ApiResponse } from "@/types";

export async function POST(): Promise<NextResponse<ApiResponse>> {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Logout API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
