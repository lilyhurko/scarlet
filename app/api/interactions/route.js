import connectDB from "@/lib/db";
import Interaction from "@/models/Interaction";
import Person from "@/models/Person";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const personId = searchParams.get("personId");

    const email = searchParams.get("email");

    let query = {};

    if (personId) {
      query.personId = personId;
    } else if (email) {
      const myPeople = await Person.find({ ownerEmail: email }).select("_id");
      const myPeopleIds = myPeople.map((p) => p._id);

      query.personId = { $in: myPeopleIds };
    } else {
      return NextResponse.json([]);
    }

    const limit = personId ? 0 : 50;

    const interactions = await Interaction.find(query)
      .populate("personId")
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json(interactions);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    
    const { personId, notes, tags, scoreChange } = await req.json();

    const redFlags = ["gaslighting", "love bombing", "narcissistic traits", "anger issues", "controlling", "future faking", "negging", "victim complex", "disrespects boundaries", "secretive / shady"];
    const greenFlags = ["consistent", "respects boundaries", "supportive", "good listener", "takes accountability", "open communicator", "emotional intelligence", "clear intentions", "makes you laugh", "reliable"];

    const formattedTags = (tags || []).map((tagString) => {
      const lowerTag = tagString.toLowerCase();
      let tagColor = "yellow"; 
      
      if (redFlags.includes(lowerTag)) tagColor = "red";
      if (greenFlags.includes(lowerTag)) tagColor = "green";
      
      return {
        label: tagString,
        type: tagColor
      };
    });

    const newInteraction = await Interaction.create({
      personId,
      notes,
      tags: formattedTags,
    });

    const impact = Number(scoreChange) || 0;
    await Person.findByIdAndUpdate(personId, {
      $inc: { vibeScore: impact },
    });

    return NextResponse.json(newInteraction, { status: 201 });
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}