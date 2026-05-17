import { NextResponse } from "next/server";
import { contentHumanizerFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await contentHumanizerFlow(body);

    return NextResponse.json({
      humanizedText: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {
      humanizedText: "AI service temporarily unavailable.",
    });
  }
}
