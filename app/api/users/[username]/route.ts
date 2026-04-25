import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import type { Types } from "mongoose";

export async function GET(_: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  await connectDB();

  const user = await User.findOne({ username }).select("-password").lean<{ _id: Types.ObjectId } & Record<string, unknown>>();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name username avatar")
    .lean();

  const totalUpvotes = posts.reduce((sum, p) => sum + ((p.upvotes as number) ?? 0), 0);

  return NextResponse.json({ user, posts, totalUpvotes });
}
