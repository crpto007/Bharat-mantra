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

<<<<<<< HEAD
    const text = await generateAIText({ prompt, temperature: 0.7 });
=======
    const text = await generateAIText(prompt, {
      temperature: 0.7,
    });
>>>>>>> main

    const outlineMatch =
      text.match(
        /OUTLINE:([\s\S]*?)SCRIPT:/
      );

    const scriptMatch =
      text.match(
        /SCRIPT:([\s\S]*?)IMAGE PROMPTS:/
      );

    const promptsMatch =
      text.match(
        /IMAGE PROMPTS:([\s\S]*)/
      );

    const imagePrompts =
      promptsMatch?.[1]
        ?.split("\n")
        .filter((p) => p.trim())
        .map((p) =>
          p.replace(/^\d+\.\s*/, "")
        ) || [];

    return NextResponse.json({
      outline:
        outlineMatch?.[1]?.trim() ||
        "No outline generated.",

      script:
        scriptMatch?.[1]?.trim() ||
        "No script generated.",

      imagePrompts,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
<<<<<<< HEAD
        error:
          getAIErrorMessage(error),
=======
        error: getAIErrorMessage(error),
>>>>>>> main
      },
      {
        status: 500,
      }
    );
  }
}