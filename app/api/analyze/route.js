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
    
    // Оновлений промпт із запитом на boundaryResponses
    const prompt = `
      You are an expert relationship psychologist and communication analyst. 
      Analyze the provided chat screenshot. 
      Identify any red flags (manipulation, gaslighting, toxic behavior), warning signs (mixed signals, inconsistency), or green flags (healthy communication, respect).
      
      Respond ONLY with a valid JSON object in the exact following format, without any markdown formatting or extra words:
      {
        "observation": "A short, analytical summary of the interaction and what the person's true intentions might be. (Write in the language of the chat)",
        "suggestedScoreChange": <number between -20 and +20 based on the interaction>,
        "tags": ["Tag1", "Tag2"],
        "boundaryResponses": [
          { "level": "Soft", "text": "Gentle boundary setting phrase" },
          { "level": "Medium", "text": "Firm but polite boundary phrase" },
          { "level": "Hard", "text": "Strict boundary or conversation ender" }
        ]
      }

      IMPORTANT RULES:
      1. Write "observation" and "boundaryResponses" text in the SAME LANGUAGE as the chat in the screenshot.
      2. If you detect Red Flags or Warning Signs, fill "boundaryResponses" with 3 ecological ways to reply and protect boundaries (Soft, Medium, Hard). 
      3. If the chat is entirely positive (only Green Flags) and no boundaries are crossed, you can leave the "boundaryResponses" array empty: [].
      
      Choose "tags" ONLY from this list (exact match): 
      Red flags: "Gaslighting", "Love Bombing", "Narcissistic traits", "Anger issues", "Controlling", "Future Faking", "Negging", "Victim Complex", "Disrespects boundaries", "Secretive / Shady"
      Warning signs: "Late reply", "Mixed Signals", "Breadcrumbing", "Talks about ex", "Bad with money", "Only late night texts", "Cancels last minute", "Self-centered"
      Green flags: "Consistent", "Respects boundaries", "Good Listener", "Emotional Intelligence", "Takes accountability", "Supportive", "Clear Intentions", "Makes you laugh", "Reliable"
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