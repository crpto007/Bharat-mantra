import { NextResponse } from "next/server";
import { generateText } from "@/ai/flows/generate-text-flow";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert analyst.

Perform a deep detailed analysis.

Respond in this language: ${body.language}

Topic:
${body.query}
`;
    const text = await generateText({
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json({
      analysis: text || "No analysis generated.",
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
