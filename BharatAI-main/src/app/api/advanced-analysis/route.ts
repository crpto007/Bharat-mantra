import { NextResponse } from "next/server";
import { advancedAnalysisFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await advancedAnalysisFlow(body);

    return NextResponse.json({
      analysis: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
