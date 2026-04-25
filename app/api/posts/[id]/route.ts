import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();

  const post = await Post.findById(id).populate("author", "name username avatar").lean<Record<string, unknown> & { upvotedBy: mongoose.Types.ObjectId[] }>();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check if the current user has already upvoted
  let upvoted = false;
  const session = await auth();
  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email }).lean<{ _id: mongoose.Types.ObjectId }>();
    if (user) {
      upvoted = post.upvotedBy.some(uid => uid.equals(user._id));
    }
  }

  return NextResponse.json({ post, upvoted });
}
