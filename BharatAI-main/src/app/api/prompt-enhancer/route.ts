import { NextResponse } from "next/server";
import { promptEnhancerFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await promptEnhancerFlow(body);

    return NextResponse.json({
      enhancedPrompt: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
