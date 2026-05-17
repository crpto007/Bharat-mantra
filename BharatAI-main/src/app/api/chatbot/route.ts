import { NextResponse } from "next/server";
<<<<<<< HEAD
import { generateAIText, getAIErrorMessage } from "@/lib/ai";
=======
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";
>>>>>>> main

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

<<<<<<< HEAD
    const text = await generateAIText({ prompt });
=======
    const text = await generateAIText(prompt);
>>>>>>> main

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
=======
    return NextResponse.json(
      {
        response: getAIErrorMessage(error),
>>>>>>> main
      },
      {
        status: 500,
      }
    );
  }
}