import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = imageBase64.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      "",
    );

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });   
 const prompt = `
      You are an expert relationship psychologist and communication analyst. 
      Analyze the provided chat screenshot. 
      Identify any red flags (manipulation, gaslighting, toxic behavior), warning signs (mixed signals, inconsistency), or green flags (healthy communication, respect).
      
      Respond ONLY with a valid JSON object in the exact following format, without any markdown formatting or extra words:
      {
        "observation": "A short, analytical summary of the interaction and what the person's true intentions might be. (Write in English or Ukrainian, depending on the chat language)",
        "suggestedScoreChange": <number between -20 and +20 based on the interaction>,
        "tags": ["Tag1", "Tag2"]
      }
      
      Choose "tags" ONLY from this list: 
      Red flags: "Gaslighting", "Love Bombing", "Narcissistic Traits", "Anger Issues", "Controlling", "Future Faking", "Negging", "Victim Complex", "Disrespects Boundaries", "Secretive / Shady"
      Warning signs: "Late Reply", "Mixed Signals", "Breadcrumbing", "Talks About Ex", "Bad with Money", "Only Late Night Texts", "Cancels Last Minute", "Self-Centered"
      Green flags: "Consistent", "Respects Boundaries", "Supportive", "Good Listener", "Takes Accountability", "Open Communicator"
    `;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysisData = JSON.parse(cleanedText);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image with AI" },
      { status: 500 },
    );
  }
}
