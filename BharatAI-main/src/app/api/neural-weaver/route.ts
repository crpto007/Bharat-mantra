import { NextResponse } from "next/server";
import { neuralWeaverFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await neuralWeaverFlow(body);

    return NextResponse.json({
      synthesizedContent: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
