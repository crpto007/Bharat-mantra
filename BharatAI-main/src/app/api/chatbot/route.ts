import { NextResponse } from "next/server";
import { generateText } from "@/ai/flows/generate-text-flow";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are BharatAI, a helpful multilingual AI assistant.

Language: ${body.language}

Previous conversation:
${body.context || "No previous context"}

User message:
${body.message}
`;
    const text = await generateText({
      prompt,
    });

    return NextResponse.json({
      response: text || "No response generated.",
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
