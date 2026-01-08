import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req) {
  try {
    const { authenticated, user } = await authMiddleware(req);

    if (!authenticated) {
      return NextResponse.json(
        { error: "Access denied. Please login." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "This is protected data",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Protected route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
