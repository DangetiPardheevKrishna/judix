import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req) {
  try {
    const { authenticated, user } = await authMiddleware(req);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
