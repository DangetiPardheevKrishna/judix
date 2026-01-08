import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { authMiddleware } from "@/middleware/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// GET user profile
export async function GET(req) {
  try {
    const { authenticated, user } = await authMiddleware(req);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const userData = await User.findById(user._id)
      .select("-password -__v")
      .lean();

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE user profile
export async function PUT(req) {
  try {
    const { authenticated, user: authUser } = await authMiddleware(req);

    if (!authenticated) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const updates = {};
    let imageFile = null;
    let oldImagePublicId = null;

    // Process form data
    for (const [key, value] of formData.entries()) {
      if (key === "image") {
        imageFile = value;
      } else if (key === "oldImagePublicId") {
        oldImagePublicId = value;
      } else {
        updates[key] = value;
      }
    }

    // Handle image upload if new image provided
    if (imageFile && imageFile.size > 0) {
      // Convert File to base64
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${imageFile.type};base64,${buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const uploadResult = await uploadImage(base64Image);

      if (!uploadResult.success) {
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 400 }
        );
      }

      updates.image = uploadResult.url;

      // Delete old image from Cloudinary if exists
      if (oldImagePublicId) {
        await deleteImage(oldImagePublicId);
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      authUser._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
