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
You are an expert analyst.

Perform a deep detailed analysis.

Respond in this language: ${body.language}

Topic:
${body.query}
`;

<<<<<<< HEAD
    const text = await generateAIText({ prompt, temperature: 0.7 });

    return NextResponse.json({
      analysis:
        text ||
        "No analysis generated.",
=======
    const text = await generateAIText(prompt, {
      temperature: 0.7,
    });

    return NextResponse.json({
      analysis: text,
>>>>>>> main
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
<<<<<<< HEAD
        error: message,
        analysis: message,
=======
        analysis: getAIErrorMessage(error),
>>>>>>> main
      },
      {
        status: 500,
      }
    );
  }
}