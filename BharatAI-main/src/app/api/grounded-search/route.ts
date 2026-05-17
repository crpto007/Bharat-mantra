import { NextResponse } from "next/server";
import { groundedSearchFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await groundedSearchFlow(body);

    return NextResponse.json({
      summary: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {
      summary: "AI service temporarily unavailable.",
    });
  }
}
