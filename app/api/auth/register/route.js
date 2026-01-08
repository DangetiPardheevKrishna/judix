import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import user from "@/models/user.js";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDB();

    // Check if user exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const User = await user.create({ name, email, password });

    // Generate token
    const token = generateToken(User._id);

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: User._id,
          name: User.name,
          email: User.email,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
