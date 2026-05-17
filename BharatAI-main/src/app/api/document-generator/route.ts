import { NextResponse } from "next/server";
import { documentGeneratorFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await documentGeneratorFlow(body);

    return NextResponse.json({
      generatedDoc: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {
      generatedDoc: "AI service temporarily unavailable.",
    });
  }
}
