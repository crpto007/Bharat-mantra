import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert AI prompt engineer.

Your task:
Rewrite the user's prompt to make it:
- clearer
- more specific
- highly effective
- optimized for AI systems
- concise but powerful

LANGUAGE:
${body.language}

ORIGINAL PROMPT:
${body.prompt}

IMPORTANT:
- Understand user intent deeply
- Add missing context if needed
- Improve clarity
- Improve output quality
- Keep it professional
- Return ONLY the enhanced prompt
`;

    const text = await generateAIText(prompt, { temperature: 0.7 });

    return NextResponse.json({
      enhancedPrompt: text || "No enhanced prompt generated.",
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
        error: message,
        enhancedPrompt: message,
      },
      {
        status: 500,
      },
    );
  }
}
