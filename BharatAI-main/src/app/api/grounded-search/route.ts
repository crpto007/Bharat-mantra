import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert research assistant.

Generate a deep and detailed summary on this topic.

TOPIC:
${body.query}

LANGUAGE:
${body.language}

Instructions:
- Give overview
- Explain key insights
- Include important details
- Add conclusion
- Make response long and informative
- Do not include source URLs
`;

    const text = await generateAIText({ prompt, temperature: 0.7 });

    return NextResponse.json({
      summary:
        text ||
        "No summary generated.",
    });

  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
        error: message,
        summary: message,
      },
      {
        status: 500,
      }
    );
  }
}