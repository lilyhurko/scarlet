import connectDB from "@/lib/db";
import Person from "@/models/Person";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const people = await Person.find({}).sort({ createdAt: -1 });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const newPerson = await Person.create({
      name: body.name,
      relation: body.relation || "dating",
      vibeScore: 0, 
      status: "active"
    });

    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}