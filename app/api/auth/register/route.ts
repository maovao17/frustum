import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const { name, email, username, password } = await req.json();

  if (!name || !email || !username || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return NextResponse.json({ error: "Email or username already in use" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&bold=true&size=128`;
  await User.create({ name, email, username, password: hashed, avatar });

  return NextResponse.json({ success: true }, { status: 201 });
}
