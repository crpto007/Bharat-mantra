import { NextResponse } from "next/server";
import { deepseek } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert AI prompt engineer.

Your task:
Rewrite the user's prompt to make it:
- clearer
- more specific
- highly effective
- optimized for AI systems
- concise but powerful

LANGUAGE:
${body.language}

ORIGINAL PROMPT:
${body.prompt}

IMPORTANT:
- Understand user intent deeply
- Add missing context if needed
- Improve clarity
- Improve output quality
- Keep it professional
- Return ONLY the enhanced prompt
`;

    const response =
      await deepseek.chat.completions.create({
        model: "deepseek/meta-llama/llama-3.3-70b-instruct:free-v3-0324",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      });

    return NextResponse.json({
      enhancedPrompt:
        response.choices[0].message.content ||
        "No enhanced prompt generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "AI service temporarily unavailable.",
      },
      {
        status: 500,
      }
    );
  }
}