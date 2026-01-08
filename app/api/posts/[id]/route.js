import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/post";
import { authMiddleware } from "@/middleware/auth";

// GET SINGLE POST
export async function GET(req, { params }) {
  try {
    await connectDB();

    // Get the post ID from params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Find post by ID and populate author information
    const post = await Post.findById(id)
      .populate("author", "name email") // Only get name and email from author
      .select("-__v"); // Exclude version key

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Optional: Increment view count (if you add views field to schema)
    // await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid post ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE POST
export async function PUT(req, { params }) {
  const auth = await authMiddleware(req);
  if (!auth.authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  console.log(id);
  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // 🔐 Only owner can edit
  if (post.author.toString() !== auth.user._id.toString()) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();
  const updatedPost = await Post.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updatedPost);
}

// DELETE POST
export async function DELETE(req, { params }) {
  const auth = await authMiddleware(req);
  if (!auth.authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  console.log(id);
  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.author.toString() !== auth.user._id.toString()) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await post.deleteOne();
  return NextResponse.json({ message: "Post deleted" });
}
