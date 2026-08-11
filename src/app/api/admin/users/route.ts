import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sanitizeMongoQuery } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    const skip = (page - 1) * pageSize;

    await connectToDatabase();

    // Build query
    const query: any = {};
    
    if (status && status !== "ALL") {
      query.status = sanitizeMongoQuery(status);
    }
    
    if (search) {
      const sanitizedSearch = sanitizeMongoQuery(search);
      query.$or = [
        { fullName: { $regex: sanitizedSearch, $options: "i" } },
        { email: { $regex: sanitizedSearch, $options: "i" } },
        { uniqueId: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    // Execute query
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        data: users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("[Admin Users API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
