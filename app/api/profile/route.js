import connectDB from "@/lib/db";
import User from "@/models/User"; 
import Interaction from "@/models/Interaction";
import Person from "@/models/Person";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  const { email, name, bio } = body; 

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { name, bio }, 
    { new: true }  
  );

  return NextResponse.json(updatedUser);
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  await User.deleteOne({ email });
  
  return NextResponse.json({ message: "Account deleted" });
}