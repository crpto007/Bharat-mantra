import { NextResponse } from "next/server";
import { healthPlannerFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await healthPlannerFlow(body);

    return NextResponse.json({
      plan: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
