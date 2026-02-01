import connectDB from "@/lib/db";
import Interaction from "@/models/Interaction";
import Person from "@/models/Person";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const personId = searchParams.get("personId");
    const query = personId ? { personId } : {};
    const limit = personId ? 0 : 10;

    const interactions = await Interaction.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json(interactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { personId, note, tags } = await req.json();

    const newInteraction = await Interaction.create({
      personId,
      notes: note,
      tags,
    });

    let scoreImpact = 0;
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        if (tag.flagType === "red") scoreImpact += 15;
        if (tag.flagType === "yellow") scoreImpact += 5;
        if (tag.flagType === "green") scoreImpact -= 10;
      });
    }

    await Person.findByIdAndUpdate(personId, {
      $inc: { vibeScore: scoreImpact },
    });

    return NextResponse.json(newInteraction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
