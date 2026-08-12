import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { sanitizeMongoQuery } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    const skip = (page - 1) * pageSize;
    
    // Build query
    const query: Record<string, unknown> = {};
    
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
    
    // Execute query — select only the fields the admin UI needs
    // Using .select("-__v") removes the version key. The toJSON transform
    // on the schema adds a string `id` from `_id`, but .lean() skips transforms,
    // so we add the id manually in the response below.
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .select("-__v")
        .lean(),
      User.countDocuments(query)
    ]);

    // Normalize _id to string id for clean JSON without ObjectId objects
    const safeUsers = users.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        id: _id?.toString(),
        ...rest,
      };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        data: safeUsers,
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
