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
You are an expert AI brainstorming facilitator.

Your task:

1. Organize the user's raw ideas into a clean structured outline.
2. Suggest new ideas and improvements.

Respond in ${body.language} language.

User Notes:
${body.rawText}

Return format:

ORGANIZED CONTENT:
...

SUGGESTIONS:
...
`;

<<<<<<< HEAD
    const text = await generateAIText({ prompt, temperature: 0.7 });
=======
    const text = await generateAIText(prompt, {
      temperature: 0.7,
    });
>>>>>>> main

    const parts = text.split("SUGGESTIONS:");

    return NextResponse.json({
      organizedContent:
        parts[0]?.replace("ORGANIZED CONTENT:", "") ||
        "No organized content generated.",

      suggestions:
        parts[1] || "No suggestions generated.",
    });
  } catch (error) {
    console.error(error);

    const message = getAIErrorMessage(error);

    return NextResponse.json(
      {
<<<<<<< HEAD
        error: message,
        organizedContent: message,
=======
        organizedContent: getAIErrorMessage(error),

        suggestions: "",
>>>>>>> main
      },
      {
        status: 500,
      }
    );
  }
}