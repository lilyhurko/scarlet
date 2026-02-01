import connectDB from "@/lib/db";
import Person from "@/models/Person";
import Interaction from "@/models/Interaction";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 

    await Interaction.deleteMany({ personId: id });

    await Person.findByIdAndDelete(id);

    return NextResponse.json({ message: "Person deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting person" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const person = await Person.findById(id);
    
    if (!person) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching person" }, { status: 500 });
  }
}