import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort     = searchParams.get("sort") ?? "trending";
  const tool     = searchParams.get("tool") ?? "";
  const category = searchParams.get("category") ?? "";
  const page     = parseInt(searchParams.get("page") ?? "1");
  const limit    = 12;

  await connectDB();

  const filter: Record<string, string> = {};
  if (tool)     filter.tool     = tool;
  if (category) filter.category = category;

  const sortOrder: Record<string, 1 | -1> =
    sort === "new" ? { createdAt: -1 } :
    sort === "top" ? { upvotes: -1 }   :
                     { upvotes: -1 };   // trending — can add time-decay later

  const posts = await Post.find(filter)
    .sort(sortOrder)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name username avatar")
    .lean();

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in to submit a prompt" }, { status: 401 });
  }

  const { title, prompt, tool, category, tags, image } = await req.json();

  if (!title || !prompt || !tool || !category || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const post = await Post.create({
    title, prompt, tool, category, image,
    tags: tags ?? [],
    author: user._id,
  });

  await post.populate("author", "name username avatar");
  return NextResponse.json({ post }, { status: 201 });
}
