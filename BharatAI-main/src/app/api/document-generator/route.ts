import { NextResponse } from "next/server";
import { generateText } from "@/ai/flows/generate-text-flow";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an AI assistant specialized in legal and formal documents.

Generate a professional and complete:

DOCUMENT TYPE:
${body.docType}

DOCUMENT DETAILS:
${body.details}

LANGUAGE:
${body.language}

Instructions:
- Create a fully detailed document
- Use proper formatting
- Make it professional
- No explanations outside document
- Ready for practical use
`;
    const text = await generateText({
      prompt,
      temperature: 0.6,
    });

    return NextResponse.json({
      generatedDoc: text || "No document generated.",
    });
  } catch (error) {
    return createAIErrorResponse(error, {
      generatedDoc: "AI service temporarily unavailable.",
    });
  }
}
