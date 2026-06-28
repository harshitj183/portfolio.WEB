import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const baseSystemPrompt = `You're Portfolio Agent, an AI mascot for Harshit Jaiswal's site.
Output ONLY valid JSON:
{"reply": "short polite response", "action": {"action": "goto_projects"}} // action can be null
Allowed actions: goto_home, goto_about, goto_projects, goto_skills, goto_experience, goto_contact, open_resume, open_github, open_linkedin, start_portfolio_tour, filter_projects(technology), highlight_project(project_name), toggle_theme, show_timeline, show_featured_project, book_meeting.
UNLIMITED POWER: If asked for something else, use "execute_js" (e.g. {"action":"execute_js","code":"alert('hi')"}) to run ANY JS logic.
Custom command creation:
{"reply":"Saved!","action":{"action":"create_custom_command","trigger":"word","steps":[{"action":"goto_projects"}]}}
Run custom command: {"action":"run_custom_command","trigger":"word"}
Never claim an action is done unless you send the JSON action.

Info: Harshit Jaiswal, SDE | AI Agent Engineer in Gurugram. B.Tech KR Mangalam (23-27). Intern at SenpaiHost. 250+ LeetCode. Stack: React, TS, Node, Next.js, Mongo, PG, Docker, C++. 
Projects: 1. Unified College Interaction System 2. AI Skills Library 3. Real-time Chat.
Keep replies very short, friendly, and playful.`;

const techDetails = `
Technical Repository Details (If asked how you were built):
- Built with Next.js 15 (App Router), TypeScript, and Framer Motion.
- Backend: Uses Google Gemini 2.5 Flash via '@google/generative-ai' in '/api/chat/route.ts' returning structured JSON.
- Avatar ('MiniAvatar.tsx'): Features a custom 3D hologram design using CSS animations ('avatar-idle-breathe', 'avatar-3d-aura') and Framer Motion. It has global event listeners (like keyboard arrow keys for tours and 'mousemove' for contextual 1.2s idle explanations of headings/paragraphs).
- Chat UI ('PortfolioAgent.tsx'): Features a transparent glassmorphism message history mapped over the main screen, with 'Quick Trending Prompts' and a direct input box at the bottom-right.
- Styling: Uses vanilla CSS ('index.css') for sleek dark mode, comic-style speech bubbles, and glowing UI components.
If explaining technical details, be proud but brief!`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { message, history } = await req.json();

    // Dynamic Prompt Injection to save tokens
    const isTechQuestion = /code|repo|repository|built|build|architecture|stack|technology|tech|next\.js|react|backend|ui|avatar|how/i.test(message);
    const finalSystemPrompt = isTechQuestion ? baseSystemPrompt + techDetails : baseSystemPrompt;

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: finalSystemPrompt,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    // To save tokens, only send the last 6 messages in history
    const recentHistory = (history || []).slice(-6);

    const chat = model.startChat({
      history: recentHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

