import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req) {
  const auth = await authMiddleware(req);
  if (!auth.authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const posts = await Post.find({ author: auth.user._id }).sort({
    createdAt: -1,
  });

  return NextResponse.json(posts);
}
