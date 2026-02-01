import connectDB from "@/lib/db";
import User from "@/models/User"; 
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    console.log("Login for:", email); 

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    console.log("Login successful!");
    return NextResponse.json({ 
      name: user.name, 
      id: user._id 
    }, { status: 200 });

  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}