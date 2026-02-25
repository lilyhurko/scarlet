import connectDB from "@/lib/db";
import Person from "@/models/Person";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get("email");

    if (!ownerEmail) {
      return NextResponse.json([]);
    }

    const people = await Person.find({ ownerEmail }).sort({ createdAt: -1 });

    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, relation, ownerEmail } = await req.json();

    if (!ownerEmail) {
      return NextResponse.json({ error: "Unauthorized: No email provided" }, { status: 401 });
    }

    const newPerson = await Person.create({
      name,
      relation,
      ownerEmail, 
    });

    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}