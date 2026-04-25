import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).select("-password").lean();
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { avatar, bio, name } = await req.json();

  await connectDB();
  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    {
      ...(avatar !== undefined && { avatar }),
      ...(bio    !== undefined && { bio    }),
      ...(name   !== undefined && { name   }),
    },
    { new: true }
  ).select("-password");

  return NextResponse.json({ user: updated });
}
