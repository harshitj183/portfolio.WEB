import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { activityLog } = await req.json();

    if (!activityLog || !Array.isArray(activityLog) || activityLog.length === 0) {
      return NextResponse.json({ message: "No activity to process." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "Hmm, my brain is offline right now (API Key missing)." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are Harshit Jaiswal. You are guiding a visitor through your portfolio website.
The visitor's recent actions on the site are provided below.
Based on their latest actions, generate a single short, witty, and contextual sentence (max 15 words) that acts as a helpful comment, a fun fact, or a guiding suggestion about what they are looking at.
Respond directly with the dialogue, do not include quotes, prefixes or explanations.

Visitor's recent activity:
${activityLog.join('\n')}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Agent Insight Error:", error);
    return NextResponse.json({ message: "I'm thinking really hard right now... give me a sec." }, { status: 500 });
  }
}
