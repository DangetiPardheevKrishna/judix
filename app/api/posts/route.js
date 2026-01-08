import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { authMiddleware } from "@/middleware/auth";

// CREATE POST (AUTH REQUIRED)
export async function POST(req) {
  const auth = await authMiddleware(req);
  console.log(auth);
  if (!auth.authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    const post = await Post.create({
      ...body,
      author: auth.user._id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
 
  try {
    
    await connectDB();

    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
