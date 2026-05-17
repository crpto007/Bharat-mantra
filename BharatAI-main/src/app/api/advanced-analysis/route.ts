import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/ai";

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

    const text = await generateAIText({ prompt, temperature: 0.7 });

    return NextResponse.json({
      analysis:
        text ||
        "No analysis generated.",
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
        error: message,
        analysis: message,
      },
      {
        status: 500,
      }
    );
  }
}