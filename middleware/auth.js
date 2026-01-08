import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/user";

export async function authMiddleware(req) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return { authenticated: false, user: null };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return { authenticated: false, user: null };
  }

  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return { authenticated: false, user: null };
  }

  return { authenticated: true, user };
}
