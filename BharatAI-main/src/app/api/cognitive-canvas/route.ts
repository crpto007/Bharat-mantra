import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

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

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.7,
    });

    const text =
      response.choices[0].message.content || "";

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

    return NextResponse.json(
      {
        organizedContent:
          "AI service temporarily unavailable.",

        suggestions: "",
      },
      {
        status: 500,
      }
    );
  }
}