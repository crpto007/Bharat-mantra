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
You are an expert Indian legal advisor.

Explain this Indian law / act / section in detail.

LAW TOPIC:
${body.topic}

TARGET LANGUAGE:
${body.targetLanguage}

INSTRUCTIONS:
- Explain in simple language
- Include history and purpose
- Include timeline
- Include amendments
- Include current legal status
- Include important sections
- Make it beginner friendly
- Use detailed explanation
- Use Hindi if requested
`;

<<<<<<< HEAD
    const text = await generateAIText({ prompt, temperature: 0.6 });

    return NextResponse.json({
      explanation:
        text ||
        "No explanation generated.",
=======
    const text = await generateAIText(prompt, {
      temperature: 0.6,
    });

    return NextResponse.json({
      explanation: text,
>>>>>>> main
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
<<<<<<< HEAD
        error:
          getAIErrorMessage(error),
=======
        explanation: getAIErrorMessage(error),
>>>>>>> main
      },
      {
        status: 500,
      }
    );
  }
}