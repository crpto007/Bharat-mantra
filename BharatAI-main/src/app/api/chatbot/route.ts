import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are BharatAI, a helpful multilingual AI assistant.

Language: ${body.language}

Previous conversation:
${body.context || "No previous context"}

User message:
${body.message}
`;

    const text = await generateAIText(prompt);

    return NextResponse.json({
      response: text,
    });
  } catch (error) {
    console.error(error);

<<<<<<< HEAD
    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
        error: message,
        response: message,
      },
      {
        status: 500,
      },
=======
    return NextResponse.json(
      {
        response: getAIErrorMessage(error),
      },
      {
        status: 500,
      }
>>>>>>> main
    );
  }
}
