import { NextResponse } from "next/server";
import { chatbotFlow } from "@/ai/flows/feature-flows";
import { createAIErrorResponse } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await chatbotFlow(body);

    return NextResponse.json({
      response: result.text,
    });
  } catch (error) {
    return createAIErrorResponse(error, {});
  }
}
