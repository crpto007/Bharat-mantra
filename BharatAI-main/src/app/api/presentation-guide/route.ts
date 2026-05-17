import { NextResponse } from "next/server";
import { presentationGuideFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await presentationGuideFlow(body);

    return NextResponse.json(result);
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
