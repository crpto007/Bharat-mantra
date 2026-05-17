import { NextResponse } from "next/server";
import { generateAIText, getAIErrorMessage } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const documentsText = body.documents
      .map((doc: string, index: number) => `DOCUMENT ${index + 1}:\n${doc}`)
      .join("\n\n");

    const prompt = `
You are a master content synthesizer and editor.

Your task is to combine multiple documents
into one highly polished final content.

USER GOAL:
${body.goal}

LANGUAGE:
${body.language}

SOURCE DOCUMENTS:
${documentsText}

IMPORTANT INSTRUCTIONS:
- Do deep synthesis
- Find connections between documents
- Resolve contradictions intelligently
- Make output highly structured
- Use markdown formatting
- Add headings and sections
- Create professional final content
- Match tone according to goal
- Add conclusion at end
`;

    const text = await generateAIText(prompt, {
      temperature: 0.7,
    });

    return NextResponse.json({
      synthesizedContent: text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        synthesizedContent: getAIErrorMessage(error),
      },
      {
        status: getAIErrorStatus(error),
      },
    );
  }
}
