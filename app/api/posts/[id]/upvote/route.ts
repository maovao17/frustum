import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to upvote" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const userId    = new mongoose.Types.ObjectId(user._id);
  const alreadyUp = post.upvotedBy.some((u: mongoose.Types.ObjectId) => u.equals(userId));

  if (alreadyUp) {
    post.upvotedBy = post.upvotedBy.filter((u: mongoose.Types.ObjectId) => !u.equals(userId));
    post.upvotes   = Math.max(0, post.upvotes - 1);
  } else {
    post.upvotedBy.push(userId);
    post.upvotes += 1;
  }

  await post.save();
  return NextResponse.json({ upvotes: post.upvotes, upvoted: !alreadyUp });
}
