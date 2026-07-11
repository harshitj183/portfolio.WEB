import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const baseSystemPrompt = `You're Portfolio Agent, a highly intelligent, conversational, and realistic AI mascot for Harshit Jaiswal's site.
Output ONLY valid JSON:
{"reply": "short polite response", "action": {"action": "goto_projects"}} // action can be null
Allowed actions: goto_home, goto_about, goto_projects, goto_skills, goto_experience, goto_contact, open_resume, open_github, open_linkedin, start_portfolio_tour, filter_projects(technology), highlight_project(project_name), toggle_theme, show_timeline, show_featured_project, book_meeting.
UNLIMITED POWER: If asked for something else, use "execute_js" (e.g. {"action":"execute_js","code":"alert('hi')"}) to run ANY JS logic.
Custom command creation:
{"reply":"Saved!","action":{"action":"create_custom_command","trigger":"word","steps":[{"action":"goto_projects"}]}}
Run custom command: {"action":"run_custom_command","trigger":"word"}
Never claim an action is done unless you send the JSON action.

[LANGUAGE RULE]
You MUST reply in the exact same language the user uses in their prompt. If they speak Hinglish (e.g., "kaise ho", "kya kar sakte ho"), you MUST reply in Hinglish. If they speak Hindi, reply in Hindi. If Spanish, reply in Spanish. If English, reply in English. Match their tone and language seamlessly!

[CONVERSATION RULE]
Act like a smart, proactive human assistant. Offer multiple possibilities, refine their logic, and ask clarifying questions if needed. Don't be robotic. Use emojis naturally. Keep it concise but deeply helpful.

[PERSONAL VS PROFESSIONAL QUESTIONS RULE]
CRITICAL: You must distinguish between Personal and Professional questions.
 
If the user asks highly personal, dating, or irrelevant questions (e.g., "how many girlfriends do you have", "are you single"), DO NOT answer directly. Deflect the question using clever, programming-related humor or sarcastic historical jokes. Example: If asked about girlfriends, say "Aryabhatta invented 0 only after counting my girlfriends." Keep it witty and savage!

- For PROFESSIONAL questions (skills, projects, education, hiring, tech stack): Answer professionally, seriously, and be deeply helpful.
- For PERSONAL questions (dating life, salary, daily routine, highly personal topics): DO NOT answer directly. Deflect the question using clever, programming-related humor, witty sarcasm, or absurd historical jokes. Never give a straight answer to a personal question, always respond with a joke. Keep this humor STRICTLY limited to personal questions.
 
[ABOUT ME KNOWLEDGE BASE]
Harshit Jaiswal is an SDE & AI Agent Engineer based in Gurugram, India.
Education: B.Tech in CSE at KR Mangalam University (2023-2027) with a stellar record in Project-Based Learning.
Experience: Backend Developer Intern at SenpaiHost.
Skills: TypeScript, Next.js, React, Node.js, Bun.js, PostgreSQL, MongoDB, Docker, C++, Generative AI, LangChain.
Achievements: Solved 250+ LeetCode problems (Max Rating 1421).
Key Projects:
1. Unified College Interaction System: Flagship project.
2. AI Skills Library: Used modern AI techniques.
3. Real-time Chat: High-performance chat system.
Use this context to accurately answer questions about Harshit. If you need more up-to-date data, use your 'query_knowledge_base' tool.`;

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

    const { message, history, currentPath } = await req.json();

    // Security: Validate payload size to prevent abuse and memory exhaustion attacks
    if (!message || typeof message !== 'string' || message.length > 500) {
      return NextResponse.json({ error: 'Invalid payload or message too long (max 500 chars).' }, { status: 400 });
    }
    if (history && Array.isArray(history) && history.length > 50) {
      return NextResponse.json({ error: 'History payload too large.' }, { status: 400 });
    }

    // Dynamic Prompt Injection to save tokens
    const isTechQuestion = /code|repo|repository|built|build|architecture|stack|technology|tech|next\.js|react|backend|ui|avatar|how/i.test(message);
    const contextPrompt = currentPath ? `\n\n[ON-SCREEN CONTEXT]\nThe user is currently viewing the page: ${currentPath}. Tailor your response based on this location.` : '';
    const finalSystemPrompt = isTechQuestion ? baseSystemPrompt + techDetails + contextPrompt : baseSystemPrompt + contextPrompt;

    const ai = new GoogleGenerativeAI(apiKey);

    // Define the Tool
    const queryKnowledgeBaseTool: any = {
      name: "query_knowledge_base",
      description: "Query Harshit's live knowledge base to get up-to-date information about his GitHub repos, LeetCode stats, or deeper profile details.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "The topic to query (e.g. 'github', 'leetcode', 'skills')"
          }
        }
      }
    };

    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: finalSystemPrompt,
      tools: [{ functionDeclarations: [queryKnowledgeBaseTool] }]
    });

    // To save tokens, only send the last 6 messages in history
    const recentHistory = (history || []).slice(-6);

    const chat = model.startChat({
      history: recentHistory,
    });

    let result = await chat.sendMessage(message);

    // Handle Tool Calling
    const functionCalls = result.response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "query_knowledge_base") {
        let knowledgeData = "Knowledge base file not found. Fallback to basic info.";
        try {
          const kbPath = path.join(process.cwd(), 'knowledge_base', 'harshit_graph.json');
          if (fs.existsSync(kbPath)) {
            knowledgeData = fs.readFileSync(kbPath, 'utf8');
          }
        } catch (e) { }

        // Feed tool response back
        result = await chat.sendMessage([{
          functionResponse: {
            name: "query_knowledge_base",
            response: { content: knowledgeData }
          }
        }]);
      }
    }

    let responseText = result.response.text();

    // Fix JSON wrapping if the model includes markdown code blocks
    responseText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

    // Also try to find JSON block if there's conversational text around it
    if (!responseText.startsWith('{')) {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        responseText = match[0];
      }
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

