import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
You are an expert presentation coach.

Create:
1. Presentation Outline
2. Full Presentation Script
3. AI Image Prompts

TOPIC:
${body.topic}

TARGET AUDIENCE:
${body.audience}

NUMBER OF SLIDES:
${body.numberOfSlides}

LANGUAGE:
${body.language}

IMPORTANT:
- Use markdown formatting
- Make outline structured
- Make script detailed
- Create engaging presentation
- Generate one image prompt for every 2 slides

FORMAT RESPONSE EXACTLY LIKE THIS:

OUTLINE:
...

SCRIPT:
...

IMAGE PROMPTS:
1.
2.
3.
`;
    const text = await generateAIText({
      prompt,
      temperature: 0.7,
    });

    const formattedText = text || "";

    const outlineMatch = formattedText.match(/OUTLINE:([\s\S]*?)SCRIPT:/);

    const scriptMatch = formattedText.match(/SCRIPT:([\s\S]*?)IMAGE PROMPTS:/);

    const promptsMatch = formattedText.match(/IMAGE PROMPTS:([\s\S]*)/);

    const imagePrompts =
      promptsMatch?.[1]
        ?.split("\n")
        .filter((p) => p.trim())
        .map((p) => p.replace(/^\d+\.\s*/, "")) || [];

    return NextResponse.json({
      outline: outlineMatch?.[1]?.trim() || "No outline generated.",

      script: scriptMatch?.[1]?.trim() || "No script generated.",

      imagePrompts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: getAIErrorMessage(error),
      },
      {
        status: 500,
      },
    );
  }
}
