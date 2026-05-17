import { NextResponse } from "next/server";
import { lawExplainerFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await lawExplainerFlow(body);

    return NextResponse.json({
      explanation: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
